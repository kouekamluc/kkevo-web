"""
Views for blog app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F, Count
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid
import os

from .models import BlogPost, BlogCategory, BlogPostView, BlogPostLike, BlogPostBookmark, BlogPostShare, BlogTag, BlogPostComment, UserReadingProgress, BlogPostAnalytics
from .serializers import (
    BlogPostListSerializer, BlogPostDetailSerializer, BlogPostCreateSerializer, BlogPostUpdateSerializer,
    BlogCategorySerializer, BlogPostViewSerializer, BlogPostLikeSerializer, 
    BlogPostBookmarkSerializer, BlogPostShareSerializer
)
from .permissions import IsAuthorOrReadOnly, IsCommentAuthorOrReadOnly, IsOwnerOrReadOnly, IsAdminOrReadOnly


class ImageUploadView(APIView):
    """Separate view for image upload - requires authentication for security"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Test endpoint to verify permissions"""
        return Response({
            'message': 'Image upload endpoint is accessible',
            'permissions': 'IsAuthenticated',
            'user': request.user.username if request.user.is_authenticated else 'Anonymous'
        })
    
    def post(self, request):
        """Upload an image for blog posts."""
        try:
            image_file = request.FILES.get('image')
            if not image_file:
                return Response({
                    'error': 'No image file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if image_file.content_type not in allowed_types:
                return Response({
                    'error': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file size (max 5MB)
            if image_file.size > 5 * 1024 * 1024:
                return Response({
                    'error': 'File size too large. Maximum size is 5MB.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate unique filename
            file_extension = os.path.splitext(image_file.name)[1]
            filename = f"blog_images/{uuid.uuid4()}{file_extension}"
            
            # Save file
            saved_path = default_storage.save(filename, ContentFile(image_file.read()))
            file_url = default_storage.url(saved_path)
            
            return Response({
                'success': True,
                'filename': filename,
                'url': file_url,
                'size': image_file.size,
                'content_type': image_file.content_type
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': f'Upload failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.filter(is_active=True)
    serializer_class = BlogCategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order']
    ordering = ['order', 'name']


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(status='published', published_at__lte=timezone.now())
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['new_category', 'is_featured']  # Use new_category for filtering
    search_fields = ['title', 'excerpt', 'body', 'author__name']
    ordering_fields = ['title', 'published_at', 'view_count', 'like_count', 'order']
    ordering = ['-is_featured', 'order', '-published_at']
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Override to show all posts for authenticated users, published only for anonymous"""
        if self.request.user.is_authenticated:
            # Authenticated users can see all posts (including drafts)
            queryset = BlogPost.objects.all()
        else:
            # Anonymous users only see published posts
            queryset = BlogPost.objects.filter(status='published', published_at__lte=timezone.now())
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(new_category__slug=category_slug)
        
        # Filter by tags - handle manually to avoid JSONField filtering issues
        tags = self.request.query_params.get('tags')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            # Use Q objects to build OR conditions for tag matching
            tag_queries = Q()
            for tag in tag_list:
                tag_queries |= Q(tags__contains=[tag])
            queryset = queryset.filter(tag_queries)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return BlogPostCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BlogPostUpdateSerializer
        elif self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def get_permissions(self):
        """Override permissions for different actions"""
        if self.action in ['list', 'retrieve', 'view', 'like', 'bookmark', 'share', 'featured', 'popular', 'recent']:
            # Read actions - allow anyone
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            # Create - require authentication and staff status
            permission_classes = [IsAdminOrReadOnly]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Update/Delete - use custom permission (author or staff only)
            permission_classes = [IsAuthorOrReadOnly]
        else:
            # Default - require authentication
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to automatically track views"""
        instance = self.get_object()
        
        # Record view automatically when post is retrieved
        referrer = request.META.get('HTTP_REFERER', '')
        if referrer is None:
            referrer = ''
            
        view_data = {
            'post': instance.id,
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'referrer': referrer
        }
        
        if request.user.is_authenticated:
            view_data['user'] = request.user.id
        
        # Create view record
        view_serializer = BlogPostViewSerializer(data=view_data)
        if view_serializer.is_valid():
            view_serializer.save()
            # Increment view count
            instance.increment_view()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        """Record a blog post view"""
        post = self.get_object()
        
        # Create view record
        referrer = request.META.get('HTTP_REFERER', '')
        if referrer is None:
            referrer = ''
            
        view_data = {
            'post': post.id,
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'referrer': referrer
        }
        
        if request.user.is_authenticated:
            view_data['user'] = request.user.id
        
        serializer = BlogPostViewSerializer(data=view_data)
        if serializer.is_valid():
            serializer.save()
            
            # Increment view count
            post.increment_view()
            
            return Response({
                'message': 'View recorded successfully',
                'view_count': post.view_count
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def like(self, request, slug=None):
        """Like or unlike a blog post"""
        post = self.get_object()
        action_type = request.data.get('action', 'like')  # 'like' or 'unlike'
        
        if action_type == 'like':
            # Check if user already liked this post
            existing_like = None
            if request.user.is_authenticated:
                existing_like = BlogPostLike.objects.filter(
                    post=post, 
                    user=request.user
                ).first()
            
            if existing_like:
                return Response({
                    'message': 'Post already liked',
                    'like_count': post.like_count
                }, status=status.HTTP_200_OK)
            
            # Create new like
            like_data = {
                'post': post.id,
                'ip_address': self._get_client_ip(request)
            }
            
            if request.user.is_authenticated:
                like_data['user'] = request.user.id
            
            serializer = BlogPostLikeSerializer(data=like_data)
            if serializer.is_valid():
                serializer.save()
                
                # Increment like count
                post.increment_like()
                
                return Response({
                    'message': 'Post liked successfully',
                    'like_count': post.like_count
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif action_type == 'unlike':
            # Remove like
            existing_like = None
            if request.user.is_authenticated:
                existing_like = BlogPostLike.objects.filter(
                    post=post, 
                    user=request.user
                ).first()
            
            if existing_like:
                existing_like.delete()
                
                # Decrement like count
                post.decrement_like()
                
                return Response({
                    'message': 'Post unliked successfully',
                    'like_count': post.like_count
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'Post not liked',
                'like_count': post.like_count
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Invalid action. Use "like" or "unlike"'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def bookmark(self, request, slug=None):
        """Bookmark or unbookmark a blog post"""
        post = self.get_object()
        action_type = request.data.get('action', 'bookmark')  # 'bookmark' or 'unbookmark'
        
        if action_type == 'bookmark':
            # Check if user already bookmarked this post
            existing_bookmark = None
            if request.user.is_authenticated:
                existing_bookmark = BlogPostBookmark.objects.filter(
                    post=post, 
                    user=request.user
                ).first()
            
            if existing_bookmark:
                return Response({
                    'message': 'Post already bookmarked',
                    'bookmark_count': post.bookmark_count
                }, status=status.HTTP_200_OK)
            
            # Create new bookmark
            bookmark_data = {
                'post': post.id,
                'ip_address': self._get_client_ip(request)
            }
            
            if request.user.is_authenticated:
                bookmark_data['user'] = request.user.id
            
            serializer = BlogPostBookmarkSerializer(data=bookmark_data)
            if serializer.is_valid():
                serializer.save()
                
                # Increment bookmark count
                post.increment_bookmark()
                
                return Response({
                    'message': 'Post bookmarked successfully',
                    'bookmark_count': post.bookmark_count
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif action_type == 'unbookmark':
            # Remove bookmark
            existing_bookmark = None
            if request.user.is_authenticated:
                existing_bookmark = BlogPostBookmark.objects.filter(
                    post=post, 
                    user=request.user
                ).first()
            
            if existing_bookmark:
                existing_bookmark.delete()
                
                # Decrement bookmark count
                post.decrement_bookmark()
                
                return Response({
                    'message': 'Post unbookmarked successfully',
                    'bookmark_count': post.bookmark_count
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'Post not bookmarked',
                'bookmark_count': post.bookmark_count
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Invalid action. Use "bookmark" or "unbookmark"'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def share(self, request, slug=None):
        """Record a blog post share"""
        post = self.get_object()
        platform = request.data.get('platform', 'other')
        
        # Create share record
        share_data = {
            'post': post.id,
            'platform': platform,
            'ip_address': self._get_client_ip(request)
        }
        
        if request.user.is_authenticated:
            share_data['user'] = request.user.id
        
        serializer = BlogPostShareSerializer(data=share_data)
        if serializer.is_valid():
            serializer.save()
            
            # Increment share count
            post.increment_share()
            
            return Response({
                'message': 'Share recorded successfully',
                'share_count': post.share_count
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        featured_posts = self.get_queryset().filter(is_featured=True)
        page = self.paginate_queryset(featured_posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular blog posts based on view count"""
        popular_posts = self.get_queryset().order_by('-view_count', '-like_count')
        page = self.paginate_queryset(popular_posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(popular_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently published blog posts"""
        recent_posts = self.get_queryset().order_by('-published_at')
        page = self.paginate_queryset(recent_posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)



    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class BlogPostViewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPostView.objects.all()
    serializer_class = BlogPostViewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'user']
    ordering_fields = ['viewed_at']
    ordering = ['-viewed_at']


class BlogPostLikeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPostLike.objects.all()
    serializer_class = BlogPostLikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'user']
    ordering_fields = ['liked_at']
    ordering = ['-liked_at']


class BlogPostBookmarkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPostBookmark.objects.all()
    serializer_class = BlogPostBookmarkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'user']
    ordering_fields = ['bookmarked_at']
    ordering = ['-bookmarked_at']


class BlogPostShareViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPostShare.objects.all()
    serializer_class = BlogPostShareSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'user', 'platform']
    ordering_fields = ['shared_at']
    ordering = ['-shared_at']


class BlogTagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for BlogTag model."""
    queryset = BlogTag.objects.all()
    serializer_class = None  # Will be added when serializer is created
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    permission_classes = [AllowAny]  # Tags are public


class BlogPostCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for BlogPostComment model."""
    queryset = BlogPostComment.objects.filter(is_approved=True)
    serializer_class = None  # Will be added when serializer is created
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'user', 'parent', 'is_approved']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter comments based on user permissions."""
        queryset = super().get_queryset()
        if self.request.user.is_authenticated and self.request.user.is_staff:
            # Staff can see all comments including unapproved ones
            return BlogPostComment.objects.all()
        return queryset.filter(is_approved=True)
    
    def get_permissions(self):
        """Override permissions for different actions"""
        if self.action in ['list', 'retrieve']:
            # Read actions - allow anyone
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            # Create - require authentication
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Update/Delete - use custom permission (comment author or staff only)
            permission_classes = [IsCommentAuthorOrReadOnly]
        else:
            # Default - require authentication
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class UserReadingProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for UserReadingProgress model."""
    queryset = UserReadingProgress.objects.all()
    serializer_class = None  # Will be added when serializer is created
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'post', 'is_completed']
    ordering_fields = ['last_read_at', 'created_at']
    ordering = ['-last_read_at']
    
    def get_queryset(self):
        """Users can only see their own reading progress."""
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=self.request.user)
    
    def get_permissions(self):
        """Override permissions for different actions"""
        if self.action in ['list', 'retrieve']:
            # Read actions - require authentication
            permission_classes = [IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            # Create/Update - require authentication
            permission_classes = [IsAuthenticated]
        elif self.action in ['destroy']:
            # Delete - use custom permission (owner or staff only)
            permission_classes = [IsOwnerOrReadOnly]
        else:
            # Default - require authentication
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class BlogPostAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for BlogPostAnalytics model."""
    queryset = BlogPostAnalytics.objects.all()
    serializer_class = None  # Will be added when serializer is created
    permission_classes = [IsAdminOrReadOnly]  # Only staff can access analytics
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post']
    ordering_fields = ['updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """Only staff can see analytics."""
        if self.request.user.is_staff:
            return super().get_queryset()
        return BlogPostAnalytics.objects.none()
