"""
Views for blog app.
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import BlogPost
from .serializers import BlogPostSerializer, BlogPostListSerializer, BlogPostDetailSerializer
from rest_framework.decorators import action


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for BlogPost model."""
    
    # Show all posts by default, let frontend handle filtering
    queryset = BlogPost.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured', 'author', 'category']
    search_fields = ['title', 'summary', 'body', 'tags']
    ordering_fields = ['published_at', 'title', 'created_at', 'updated_at']
    ordering = ['-published_at', '-created_at']
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return BlogPostListSerializer
        elif self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostSerializer
    
    def get_queryset(self):
        """Return filtered queryset."""
        queryset = super().get_queryset()
        
        # Get filter parameters
        status = self.request.query_params.get('status', None)
        published_only = self.request.query_params.get('published_only', 'true').lower() == 'true'
        
        # Apply status filtering
        if status:
            queryset = queryset.filter(status=status)
        elif published_only:
            # Only show published posts with past published_at date
            queryset = queryset.filter(
                status='published',
                published_at__lte=timezone.now()
            )
        
        # Filter by tags if provided
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__overlap=tag_list)
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by featured posts if requested
        featured = self.request.query_params.get('is_featured', None)
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            queryset = queryset.filter(is_featured=featured_bool)
        
        # Filter by search query if provided
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                title__icontains=search
            ) | queryset.filter(
                summary__icontains=search
            ) | queryset.filter(
                body__icontains=search
            ) | queryset.filter(
                tags__contains=[search]
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts."""
        featured_posts = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent blog posts."""
        recent_posts = self.get_queryset()[:5]
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)
