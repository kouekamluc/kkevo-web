import boto3
import logging
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
import json
from datetime import datetime, timedelta

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Resource, ResourceCategory, ResourceType, ResourceDownload, ResourceRating, ResourceView
from .serializers import (
    ResourceListSerializer, ResourceDetailSerializer, ResourceCreateSerializer, ResourceUpdateSerializer,
    ResourceCategorySerializer, ResourceTypeSerializer,
    ResourceDownloadSerializer, ResourceRatingSerializer, ResourceViewSerializer
)


logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class DjangoSaasChecklistDownloadView(View):
    """
    Generate presigned S3 URL for Django SaaS Checklist PDF download
    """
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            firstName = data.get('firstName')
            
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            
            # Log the download request for analytics
            logger.info(f"PDF download requested for email: {email}, name: {firstName}")
            
            # Generate presigned URL for S3 download
            download_url = self._generate_presigned_url(email, firstName)
            
            return JsonResponse({
                'downloadUrl': download_url,
                'message': 'Download URL generated successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"Error generating download URL: {str(e)}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
    
    def _generate_presigned_url(self, email, firstName):
        """
        Generate a presigned S3 URL for the Django SaaS Checklist PDF
        """
        try:
            # Initialize S3 client
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            # Generate presigned URL (expires in 1 hour)
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                    'Key': 'resources/django-saas-checklist.pdf'
                },
                ExpiresIn=3600  # 1 hour
            )
            
            return presigned_url
            
        except Exception as e:
            logger.error(f"Error generating S3 presigned URL: {str(e)}")
            # Fallback: return a direct download link if S3 is not configured
            return f"/static/resources/django-saas-checklist.pdf?email={email}&name={firstName}"


# Fallback view for direct downloads (when S3 is not configured)
@csrf_exempt
@require_http_methods(["POST"])
def django_saas_checklist_download_fallback(request):
    """
    Fallback download endpoint when S3 is not configured
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        firstName = data.get('firstName')
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        # Log the download request
        logger.info(f"Fallback PDF download for email: {email}, name: {firstName}")
        
        # Return a direct link to the static file
        download_url = f"/static/resources/django-saas-checklist.pdf"
        
        return JsonResponse({
            'downloadUrl': download_url,
            'message': 'Download URL generated successfully (fallback mode)'
        })
        
    except Exception as e:
        logger.error(f"Error in fallback download: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


class ResourceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceCategory.objects.filter(is_active=True)
    serializer_class = ResourceCategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order']
    ordering = ['order', 'name']


class ResourceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceType.objects.filter(is_active=True)
    serializer_class = ResourceTypeSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order']
    ordering = ['order', 'name']


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category', 'is_featured', 'is_premium']
    search_fields = ['title', 'description', 'tags', 'author']
    ordering_fields = ['title', 'download_count', 'view_count', 'rating', 'published_at', 'order']
    ordering = ['-is_featured', 'order', '-published_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'create':
            return ResourceCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ResourceUpdateSerializer
        elif self.action == 'retrieve':
            return ResourceDetailSerializer
        return ResourceListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by type slug
        type_slug = self.request.query_params.get('type_slug')
        if type_slug:
            queryset = queryset.filter(type__slug=type_slug)
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by tags
        tags = self.request.query_params.get('tags')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__overlap=tag_list)
        
        return queryset

    @action(detail=True, methods=['post'])
    def download(self, request, slug=None):
        """Record a resource download"""
        resource = self.get_object()
        
        # Create download record
        referrer = request.META.get('HTTP_REFERER', '')
        if referrer is None:
            referrer = ''
            
        download_data = {
            'resource': resource.id,
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'referrer': referrer
        }
        
        if request.user.is_authenticated:
            download_data['user'] = request.user.id
        
        serializer = ResourceDownloadSerializer(data=download_data)
        if serializer.is_valid():
            serializer.save()
            
            # Increment download count
            resource.increment_download()
            
            return Response({
                'message': 'Download recorded successfully',
                'download_count': resource.download_count
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def rate(self, request, slug=None):
        """Rate a resource"""
        resource = self.get_object()
        rating_value = request.data.get('rating')
        comment = request.data.get('comment', '')
        
        if not rating_value or not isinstance(rating_value, int) or rating_value < 1 or rating_value > 5:
            return Response(
                {'error': 'Rating must be an integer between 1 and 5'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already rated this resource
        existing_rating = None
        if request.user.is_authenticated:
            existing_rating = ResourceRating.objects.filter(
                resource=resource, 
                user=request.user
            ).first()
        
        if existing_rating:
            # Update existing rating
            existing_rating.rating = rating_value
            existing_rating.comment = comment
            existing_rating.save()
            
            # Recalculate average rating
            ratings = ResourceRating.objects.filter(resource=resource)
            total_rating = sum(r.rating for r in ratings)
            resource.rating = total_rating / ratings.count()
            resource.rating_count = ratings.count()
            resource.save()
            
            return Response({
                'message': 'Rating updated successfully',
                'rating': resource.rating,
                'rating_count': resource.rating_count
            }, status=status.HTTP_200_OK)
        else:
            # Create new rating
            rating_data = {
                'resource': resource.id,
                'rating': rating_value,
                'comment': comment,
                'ip_address': self._get_client_ip(request)
            }
            
            if request.user.is_authenticated:
                rating_data['user'] = request.user.id
            
            serializer = ResourceRatingSerializer(data=rating_data)
            if serializer.is_valid():
                serializer.save()
                
                return Response({
                    'message': 'Rating submitted successfully',
                    'rating': resource.rating,
                    'rating_count': resource.rating_count
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        """Record a resource view"""
        resource = self.get_object()
        
        # Create view record
        referrer = request.META.get('HTTP_REFERER', '')
        if referrer is None:
            referrer = ''
            
        view_data = {
            'resource': resource.id,
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'referrer': referrer
        }
        
        if request.user.is_authenticated:
            view_data['user'] = request.user.id
        
        serializer = ResourceViewSerializer(data=view_data)
        if serializer.is_valid():
            serializer.save()
            
            # Increment view count
            resource.increment_view()
            
            return Response({
                'message': 'View recorded successfully',
                'view_count': resource.view_count
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured resources"""
        featured_resources = self.get_queryset().filter(is_featured=True)
        page = self.paginate_queryset(featured_resources)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(featured_resources, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular resources based on download count"""
        popular_resources = self.get_queryset().order_by('-download_count', '-view_count')
        page = self.paginate_queryset(popular_resources)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(popular_resources, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently published resources"""
        recent_resources = self.get_queryset().order_by('-published_at')
        page = self.paginate_queryset(recent_resources)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recent_resources, many=True)
        return Response(serializer.data)

    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ResourceDownloadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceDownload.objects.all()
    serializer_class = ResourceDownloadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['resource', 'user']
    ordering_fields = ['downloaded_at']
    ordering = ['-downloaded_at']


class ResourceRatingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceRating.objects.all()
    serializer_class = ResourceRatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['resource', 'user', 'rating']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']


class ResourceViewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceView.objects.all()
    serializer_class = ResourceViewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['resource', 'user']
    ordering_fields = ['viewed_at']
    ordering = ['-viewed_at']

