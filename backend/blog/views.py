"""
Views for blog app.
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import BlogPost
from .serializers import BlogPostSerializer, BlogPostListSerializer, BlogPostDetailSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for BlogPost model."""
    
    queryset = BlogPost.objects.filter(
        status='published',
        published_at__lte=timezone.now()
    )
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured', 'author']
    search_fields = ['title', 'summary', 'body', 'tags']
    ordering_fields = ['published_at', 'title', 'created_at']
    ordering = ['-published_at', '-created_at']
    
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
        
        # Filter by tags if provided
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__overlap=tag_list)
        
        # Filter by featured posts if requested
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            queryset = queryset.filter(is_featured=featured_bool)
        
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
