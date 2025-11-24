"""
Views for blog app.
"""
from rest_framework import viewsets, status, filters, pagination
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
    BlogPostBookmarkSerializer, BlogPostShareSerializer, BlogTagSerializer,
    BlogPostCommentSerializer, UserReadingProgressSerializer, BlogPostAnalyticsSerializer
)
from .permissions import IsAuthorOrReadOnly, IsOwnerOrReadOnly


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


class BlogHealthCheckView(APIView):
    """Health check endpoint for blog functionality"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Check if blog is working properly"""
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
                'error': str(e),
                'timestamp': timezone.now().isoformat()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
    pagination_class = pagination.PageNumberPagination

    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get posts for a specific category"""
        category = self.get_object()
        posts = BlogPost.objects.filter(
            new_category=category,
            status='published',
            published_at__lte=timezone.now()
        ).order_by('-published_at')
        
        # Apply pagination
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


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
        if hasattr(self.request, 'user') and self.request.user.is_authenticated:
            # Authenticated users can see all posts (including drafts)
            queryset = BlogPost.objects.all()
        else:
            # Anonymous users only see published posts
            queryset = BlogPost.objects.filter(status='published', published_at__lte=timezone.now())
        
        # Filter by category slug - check if request has query_params (DRF Request)
        if hasattr(self.request, 'query_params'):
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
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Update/Delete - use custom permission (author or staff only)
            permission_classes = [IsAuthorOrReadOnly]
        else:
            # Default - require authentication
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to automatically track views"""
        try:
            instance = self.get_object()
            
            # Record view automatically when post is retrieved
            referrer = request.META.get('HTTP_REFERER', '')
            if referrer is None:
                referrer = ''
                
            view_data = {
                'post': instance,
                'ip_address': self._get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'referrer': referrer
            }
            
            if request.user.is_authenticated:
                view_data['user'] = request.user
            
            # Create view record - handle errors gracefully
            try:
                view_serializer = BlogPostViewSerializer(data=view_data)
                if view_serializer.is_valid():
                    view_serializer.save()
                    # Increment view count
                    instance.increment_view()
            except Exception as e:
                # Log error but don't fail the request
                print(f"Error recording view: {e}")
                pass
            
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
            
        except Exception as e:
            print(f"Error in blog post retrieve: {e}")
            return Response(
                {'error': 'Failed to retrieve blog post'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        """Record a blog post view"""
        try:
            post = self.get_object()
            
            # Create view record
            referrer = request.META.get('HTTP_REFERER', '')
            if referrer is None:
                referrer = ''
                
            view_data = {
                'post': post,
                'ip_address': self._get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'referrer': referrer
            }
            
            if request.user.is_authenticated:
                view_data['user'] = request.user
            
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
            
        except Exception as e:
            print(f"Error recording view: {e}")
            return Response(
                {'error': 'Failed to record view'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, slug=None):
        """Like or unlike a blog post - requires authentication"""
        try:
            post = self.get_object()
            action_type = request.data.get('action', 'like')
            
            # Get client IP
            ip = '127.0.0.1'  # Default IP
            try:
                ip = self._get_client_ip(request)
            except Exception:
                pass
            
            if action_type == 'like':
                # Check if user already liked this post
                existing_like = BlogPostLike.objects.filter(
                    post=post, 
                    user=request.user
                ).first()
                
                if existing_like:
                    return Response({
                        'message': 'Post already liked',
                        'like_count': post.like_count
                    }, status=status.HTTP_200_OK)
                
                # Create new like - user is guaranteed to be authenticated
                BlogPostLike.objects.create(
                    post=post,
                    user=request.user,
                    ip_address=ip
                )
                
                # Increment like count
                post.increment_like()
                
                return Response({
                    'message': 'Post liked successfully',
                    'like_count': post.like_count
                }, status=status.HTTP_201_CREATED)
            
            elif action_type == 'unlike':
                # Remove like
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

            
        except Exception as e:
            print(f"Error in like method: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Failed to process like action: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, slug=None):
        """Bookmark or unbookmark a blog post - requires authentication"""
        post = self.get_object()
        action_type = request.data.get('action', 'bookmark')  # 'bookmark' or 'unbookmark'
        
        # Get client IP
        ip = '127.0.0.1'  # Default IP
        try:
            ip = self._get_client_ip(request)
        except Exception:
            pass
        
        if action_type == 'bookmark':
            # Check if user already bookmarked this post
            existing_bookmark = BlogPostBookmark.objects.filter(
                post=post, 
                user=request.user
            ).first()
            
            if existing_bookmark:
                return Response({
                    'message': 'Post already bookmarked',
                    'bookmark_count': post.bookmark_count
                }, status=status.HTTP_200_OK)
            
            # Create new bookmark - user is guaranteed to be authenticated
            BlogPostBookmark.objects.create(
                post=post,
                user=request.user,
                ip_address=ip
            )
            
            # Increment bookmark count
            post.increment_bookmark()
            
            return Response({
                'message': 'Post bookmarked successfully',
                'bookmark_count': post.bookmark_count
            }, status=status.HTTP_201_CREATED)
        
        elif action_type == 'unbookmark':
            # Remove bookmark
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

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def share(self, request, slug=None):
        """Record a blog post share - requires authentication"""
        post = self.get_object()
        platform = request.data.get('platform', 'other')
        
        # Get client IP
        ip = '127.0.0.1'  # Default IP
        try:
            ip = self._get_client_ip(request)
        except Exception:
            pass
        
        # Create share record - user is guaranteed to be authenticated
        BlogPostShare.objects.create(
            post=post,
            user=request.user,
            platform=platform,
            ip_address=ip
        )
        
        # Increment share count
        post.increment_share()
        
        return Response({
            'message': 'Share recorded successfully',
            'share_count': post.share_count
        }, status=status.HTTP_201_CREATED)



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

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search blog posts"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        posts = self.get_queryset().filter(
            Q(title__icontains=query) | Q(excerpt__icontains=query) | Q(body__icontains=query)
        )
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard data for authenticated users"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get user's reading progress
        reading_progress = UserReadingProgress.objects.filter(user=request.user)
        
        # Get user's liked posts
        liked_posts = BlogPostLike.objects.filter(user=request.user).values_list('post', flat=True)
        
        # Get user's bookmarked posts
        bookmarked_posts = BlogPostBookmark.objects.filter(user=request.user).values_list('post', flat=True)
        
        dashboard_data = {
            'reading_progress': UserReadingProgressSerializer(reading_progress, many=True).data,
            'liked_posts_count': len(liked_posts),
            'bookmarked_posts_count': len(bookmarked_posts),
            'recently_read': self.get_serializer(
                self.get_queryset().filter(id__in=reading_progress.values_list('post', flat=True))[:5], 
                many=True
            ).data
        }
        
        return Response(dashboard_data)

    @action(detail=False, methods=['get'])
    def my_activity(self, request):
        """Get user's blog activity"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get user's comments
        comments = BlogPostComment.objects.filter(user=request.user).order_by('-created_at')[:10]
        
        # Get user's likes
        likes = BlogPostLike.objects.filter(user=request.user).order_by('-liked_at')[:10]
        
        # Get user's bookmarks
        bookmarks = BlogPostBookmark.objects.filter(user=request.user).order_by('-bookmarked_at')[:10]
        
        activity_data = {
            'recent_comments': BlogPostCommentSerializer(comments, many=True).data,
            'recent_likes': BlogPostLikeSerializer(likes, many=True).data,
            'recent_bookmarks': BlogPostBookmarkSerializer(bookmarks, many=True).data,
        }
        
        return Response(activity_data)



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
    serializer_class = BlogTagSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    permission_classes = [AllowAny]  # Tags are public

    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get posts for a specific tag"""
        tag = self.get_object()
        posts = BlogPost.objects.filter(
            tags__contains=[tag.name],
            status='published',
            published_at__lte=timezone.now()
        ).order_by('-published_at')
        
        # Apply pagination
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


class BlogPostCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for BlogPostComment model."""
    queryset = BlogPostComment.objects.filter(is_approved=True)
    serializer_class = BlogPostCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]  # Remove DjangoFilterBackend to handle post filtering manually
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
            permission_classes = [IsOwnerOrReadOnly]
        else:
            # Default - require authentication
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def list(self, request, *args, **kwargs):
        """Override list to handle post filtering properly"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filter by post if specified
        post_id = request.query_params.get('post')
        if post_id:
            from .models import BlogPost
            
            # Try to get the post directly first
            try:
                post = BlogPost.objects.get(id=post_id)
                queryset = queryset.filter(post=post)
            except BlogPost.DoesNotExist:
                # If direct lookup fails, try to find posts that contain this ID pattern
                try:
                    from django.db import connection
                    cursor = connection.cursor()
                    cursor.execute(
                        'SELECT id FROM blog_blogpost WHERE id::text LIKE %s',
                        [f'%{post_id}%']
                    )
                    post_ids = [row[0] for row in cursor.fetchall()]
                    
                    if len(post_ids) == 1:
                        post_id_full = post_ids[0]
                        queryset = queryset.filter(post_id=post_id_full)
                    elif len(post_ids) > 1:
                        # Multiple posts match the ID pattern
                        return Response({
                            'error': f'Multiple posts match ID pattern "{post_id}". Please use full UUID.',
                            'results': [],
                            'count': 0
                        }, status=400)
                    else:
                        return Response({
                            'error': f'Blog post with ID "{post_id}" not found',
                            'results': [],
                            'count': 0
                        }, status=400)
                except Exception as e:
                    # If there's an error with the database query, return error
                    return Response({
                        'error': f'Database error while searching for post ID "{post_id}": {str(e)}',
                        'results': [],
                        'count': 0
                    }, status=500)
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """Save the comment with the authenticated user."""
        serializer.save(user=self.request.user)


class UserReadingProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for UserReadingProgress model - requires authentication."""
    queryset = UserReadingProgress.objects.all()
    serializer_class = UserReadingProgressSerializer
    permission_classes = [IsAuthenticated]  # Require authentication for all actions
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'post', 'is_completed']
    ordering_fields = ['last_read_at', 'created_at']
    ordering = ['-last_read_at']
    
    def get_queryset(self):
        """Users can only see their own reading progress."""
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Save the reading progress with the authenticated user."""
        serializer.save(user=self.request.user)


class BlogPostAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for BlogPostAnalytics model."""
    queryset = BlogPostAnalytics.objects.all()
    serializer_class = BlogPostAnalyticsSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access analytics
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post']
    ordering_fields = ['updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """Only staff can see analytics."""
        if self.request.user.is_staff:
            return super().get_queryset()
        return BlogPostAnalytics.objects.none()
