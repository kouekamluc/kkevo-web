"""
Enhanced views for blog app with proper service layer integration.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q, Count, F
from django.core.cache import cache
from django.core.exceptions import ValidationError

from .models import (
    BlogPost, BlogCategory, BlogPostLike, BlogPostBookmark, 
    BlogPostShare, BlogTag, BlogPostComment, UserReadingProgress
)
from .serializers_v2 import (
    BlogPostListSerializer, BlogPostDetailSerializer, BlogPostCreateSerializer,
    BlogPostUpdateSerializer, BlogCategorySerializer, BlogTagSerializer,
    BlogPostLikeSerializer, BlogPostBookmarkSerializer, BlogPostShareSerializer,
    BlogPostCommentSerializer, UserReadingProgressSerializer,
    BlogInteractionRequestSerializer, ReadingProgressRequestSerializer
)
from .services import (
    BlogPostService, BlogInteractionService, ReadingProgressService
)
from .permissions import (
    IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly, IsOwnerOrReadOnly,
    IsAuthenticatedForInteractions, CanModerateComments, CanViewAnalytics
)
from .exceptions import BlogServiceError, DuplicateActionError, BlogValidationError


class BlogHealthCheckView(APIView):
    """Health check endpoint for blog functionality."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Check if blog is working properly."""
        try:
            # Check if we can query blog posts
            post_count = BlogPost.objects.count()
            category_count = BlogCategory.objects.count()
            
            return Response({
                'status': 'healthy',
                'message': 'Blog system is working properly',
                'post_count': post_count,
                'category_count': category_count,
                'timestamp': timezone.now().isoformat()
            })
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'message': f'Blog system error: {str(e)}',
                'timestamp': timezone.now().isoformat()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for blog categories."""
    queryset = BlogCategory.objects.filter(is_active=True)
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'order', 'created_at']
    ordering = ['order', 'name']
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get posts for a specific category."""
        category = self.get_object()
        posts = BlogPostService.get_published_posts({'category_slug': slug})
        
        # Paginate results
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class BlogTagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for blog tags."""
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get posts for a specific tag."""
        tag = self.get_object()
        posts = BlogPostService.get_published_posts({'tags': tag.name})
        
        # Paginate results
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for blog posts with comprehensive functionality."""
    queryset = BlogPost.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured', 'new_category', 'author']
    search_fields = ['title', 'excerpt', 'body', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'published_at', 'view_count', 'like_count']
    ordering = ['-published_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return BlogPostCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BlogPostUpdateSerializer
        elif self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer
    
    def get_queryset(self):
        """Return appropriate queryset based on user permissions."""
        if self.request.user.is_staff:
            # Staff can see all posts
            return super().get_queryset().select_related('author', 'new_category')
        elif self.request.user.is_authenticated:
            # Authenticated users can see published posts and their own drafts
            return super().get_queryset().filter(
                Q(status='published', published_at__lte=timezone.now()) |
                Q(author=self.request.user)
            ).select_related('author', 'new_category')
        else:
            # Anonymous users can only see published posts
            return super().get_queryset().filter(
                status='published',
                published_at__lte=timezone.now()
            ).select_related('author', 'new_category')
    
    def get_permissions(self):
        """Return appropriate permissions based on action."""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthorOrReadOnly]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        
        return [permission() for permission in permission_classes]
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a blog post and record view."""
        instance = self.get_object()
        
        # Record view for published posts
        if instance.status == 'published':
            try:
                from .models import BlogPostView
                BlogPostView.objects.create(
                    post=instance,
                    ip_address=self._get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    referrer=request.META.get('HTTP_REFERER', '')
                )
                instance.increment_view()
            except Exception as e:
                # Log error but don't fail the request
                print(f"Error recording view: {e}")
        
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedForInteractions])
    def like(self, request, slug=None):
        """Like or unlike a blog post."""
        try:
            post = self.get_object()
            serializer = BlogInteractionRequestSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            action_type = serializer.validated_data['action']
            ip_address = self._get_client_ip(request)
            
            if action_type == 'like':
                result = BlogInteractionService.like_post(request.user, post, ip_address)
            elif action_type == 'unlike':
                result = BlogInteractionService.unlike_post(request.user, post)
            else:
                return Response(
                    {'error': 'Invalid action. Use "like" or "unlike"'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(result, status=status.HTTP_200_OK)
            
        except DuplicateActionError as e:
            return Response({'error': str(e)}, status=status.HTTP_409_CONFLICT)
        except BlogValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except BlogServiceError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedForInteractions])
    def bookmark(self, request, slug=None):
        """Bookmark or unbookmark a blog post."""
        try:
            post = self.get_object()
            serializer = BlogInteractionRequestSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            action_type = serializer.validated_data['action']
            ip_address = self._get_client_ip(request)
            
            if action_type == 'bookmark':
                result = BlogInteractionService.bookmark_post(request.user, post, ip_address)
            elif action_type == 'unbookmark':
                result = BlogInteractionService.unbookmark_post(request.user, post)
            else:
                return Response(
                    {'error': 'Invalid action. Use "bookmark" or "unbookmark"'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(result, status=status.HTTP_200_OK)
            
        except DuplicateActionError as e:
            return Response({'error': str(e)}, status=status.HTTP_409_CONFLICT)
        except BlogValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except BlogServiceError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedForInteractions])
    def share(self, request, slug=None):
        """Record a blog post share."""
        try:
            post = self.get_object()
            serializer = BlogInteractionRequestSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            platform = serializer.validated_data.get('platform', 'other')
            ip_address = self._get_client_ip(request)
            
            result = BlogInteractionService.share_post(request.user, post, platform, ip_address)
            return Response(result, status=status.HTTP_201_CREATED)
            
        except BlogServiceError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts."""
        posts = BlogPostService.get_featured_posts(limit=5)
        serializer = BlogPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular blog posts."""
        posts = BlogPostService.get_popular_posts(limit=5)
        serializer = BlogPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recently published blog posts."""
        posts = BlogPostService.get_published_posts()
        serializer = BlogPostListSerializer(posts[:5], many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search blog posts."""
        search_term = request.query_params.get('q', '')
        if not search_term:
            return Response({'error': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        posts = BlogPostService.get_published_posts({'search': search_term})
        
        # Paginate results
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def dashboard(self, request):
        """Get dashboard data for authenticated users."""
        try:
            interactions = BlogInteractionService.get_user_interactions(request.user)
            reading_progress = ReadingProgressService.get_user_reading_progress(request.user, limit=5)
            
            dashboard_data = {
                'interactions': interactions,
                'recent_reading_progress': UserReadingProgressSerializer(
                    reading_progress, many=True, context={'request': request}
                ).data,
                'recent_posts': BlogPostListSerializer(
                    BlogPostService.get_published_posts()[:5], 
                    many=True, 
                    context={'request': request}
                ).data
            }
            
            return Response(dashboard_data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_client_ip(self, request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class BlogPostCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for blog post comments."""
    queryset = BlogPostComment.objects.all()
    serializer_class = BlogPostCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'is_approved', 'is_moderated']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Return appropriate queryset based on user permissions."""
        if self.request.user.is_staff:
            # Staff can see all comments
            return super().get_queryset().select_related('user', 'post')
        else:
            # Regular users can only see approved comments
            return super().get_queryset().filter(
                is_approved=True
            ).select_related('user', 'post')
    
    def get_permissions(self):
        """Return appropriate permissions based on action."""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'], permission_classes=[CanModerateComments])
    def moderate(self, request, pk=None):
        """Moderate a comment."""
        comment = self.get_object()
        is_approved = request.data.get('is_approved', False)
        moderation_notes = request.data.get('moderation_notes', '')
        
        comment.is_approved = is_approved
        comment.is_moderated = True
        comment.moderated_at = timezone.now()
        comment.moderation_notes = moderation_notes
        comment.save()
        
        return Response({
            'message': 'Comment moderated successfully',
            'is_approved': comment.is_approved
        })


class UserReadingProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for user reading progress."""
    queryset = UserReadingProgress.objects.all()
    serializer_class = UserReadingProgressSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'is_completed']
    ordering_fields = ['last_read_at', 'created_at']
    ordering = ['-last_read_at']
    
    def get_queryset(self):
        """Users can only see their own reading progress."""
        if self.request.user.is_staff:
            return super().get_queryset().select_related('user', 'post')
        return super().get_queryset().filter(
            user=self.request.user
        ).select_related('post')
    
    def create(self, request, *args, **kwargs):
        """Create or update reading progress."""
        try:
            serializer = ReadingProgressRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            post_id = request.data.get('post')
            if not post_id:
                return Response({'error': 'Post ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                post = BlogPost.objects.get(id=post_id)
            except BlogPost.DoesNotExist:
                return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
            
            result = ReadingProgressService.update_progress(
                user=request.user,
                post=post,
                progress_percentage=serializer.validated_data['progress_percentage'],
                time_spent=serializer.validated_data['time_spent'],
                last_position=serializer.validated_data['last_position']
            )
            
            return Response(result, status=status.HTTP_201_CREATED)
            
        except BlogValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except BlogServiceError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get user's reading analytics."""
        try:
            analytics = ReadingProgressService.get_reading_analytics(request.user)
            return Response(analytics)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
