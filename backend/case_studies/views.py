from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CaseStudy
from .serializers import CaseStudyListSerializer, CaseStudyDetailSerializer, CaseStudyCreateSerializer


class CaseStudyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for case studies.
    Read-only for public access.
    """
    queryset = CaseStudy.objects.filter(is_published=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'client_industry', 'is_featured', 'is_published']
    search_fields = ['title', 'subtitle', 'summary', 'description', 'client_name']
    ordering_fields = ['order', 'created_at', 'published_at']
    ordering = ['order', '-published_at', '-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CaseStudyListSerializer
        return CaseStudyDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category if specified
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by featured case studies
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            queryset = queryset.filter(is_featured=featured_bool)
        
        # Filter by industry
        industry = self.request.query_params.get('industry', None)
        if industry:
            queryset = queryset.filter(client_industry__icontains=industry)
        
        # Apply ordering
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            queryset = queryset.order_by(ordering)
        else:
            # Use default ordering
            queryset = queryset.order_by('order', '-published_at', '-created_at')
        
        return queryset
    
    def retrieve(self, request, slug=None):
        """Retrieve a case study by slug."""
        case_study = get_object_or_404(CaseStudy, slug=slug, is_published=True)
        serializer = self.get_serializer(case_study)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        """List case studies with optional filtering."""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Apply pagination if specified
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
