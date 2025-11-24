"""
Business logic services for blog operations.
This layer separates business logic from views and models.
"""
from typing import Optional, Dict, Any, List
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Q, F, Count, Avg, Sum
from django.core.cache import cache

from .models import (
    BlogPost, BlogPostLike, BlogPostBookmark, BlogPostShare, 
    BlogPostComment, UserReadingProgress, BlogPostView
)
from .exceptions import BlogServiceError, DuplicateActionError, BlogValidationError


class BlogPostService:
    """Service for blog post operations."""
    
    @staticmethod
    def get_published_posts(filters: Optional[Dict[str, Any]] = None) -> List[BlogPost]:
        """Get published blog posts with optional filters."""
        queryset = BlogPost.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).select_related('author', 'new_category').prefetch_related('tags')
        
        if filters:
            if filters.get('category_slug'):
                queryset = queryset.filter(new_category__slug=filters['category_slug'])
            
            if filters.get('tags'):
                tag_list = [tag.strip() for tag in filters['tags'].split(',')]
                tag_queries = Q()
                for tag in tag_list:
                    tag_queries |= Q(tags__contains=[tag])
                queryset = queryset.filter(tag_queries)
            
            if filters.get('search'):
                search_term = filters['search']
                queryset = queryset.filter(
                    Q(title__icontains=search_term) |
                    Q(excerpt__icontains=search_term) |
                    Q(body__icontains=search_term)
                )
        
        return queryset.order_by('-published_at')
    
    @staticmethod
    def get_featured_posts(limit: int = 5) -> List[BlogPost]:
        """Get featured blog posts."""
        cache_key = f"featured_posts_{limit}"
        cached_posts = cache.get(cache_key)
        
        if cached_posts is None:
            posts = BlogPost.objects.filter(
                status='published',
                is_featured=True,
                published_at__lte=timezone.now()
            ).select_related('author', 'new_category').order_by('-published_at')[:limit]
            
            cache.set(cache_key, list(posts), 300)  # Cache for 5 minutes
            return posts
        
        return cached_posts
    
    @staticmethod
    def get_popular_posts(limit: int = 5) -> List[BlogPost]:
        """Get popular blog posts based on view count."""
        cache_key = f"popular_posts_{limit}"
        cached_posts = cache.get(cache_key)
        
        if cached_posts is None:
            posts = BlogPost.objects.filter(
                status='published',
                published_at__lte=timezone.now()
            ).select_related('author', 'new_category').order_by('-view_count', '-published_at')[:limit]
            
            cache.set(cache_key, list(posts), 600)  # Cache for 10 minutes
            return posts
        
        return cached_posts
    
    @staticmethod
    def get_related_posts(post: BlogPost, limit: int = 3) -> List[BlogPost]:
        """
        Get related posts using intelligent algorithm:
        1. Posts with same category and matching tags (highest priority)
        2. Posts with same category (medium priority)
        3. Posts with matching tags (medium priority)
        4. Recent popular posts (fallback)
        """
        cache_key = f"related_posts_{post.id}_{limit}"
        cached_posts = cache.get(cache_key)
        
        if cached_posts is None:
            related_posts = []
            
            # Priority 1: Same category + matching tags
            if post.new_category and post.tags:
                tag_queries = Q()
                for tag in post.tags:
                    tag_queries |= Q(tags__contains=[tag])
                
                priority1 = BlogPost.objects.filter(
                    status='published',
                    published_at__lte=timezone.now(),
                    new_category=post.new_category
                ).filter(tag_queries).exclude(id=post.id).select_related('author', 'new_category')
                
                # Score by tag matches and recency
                priority1 = priority1.annotate(
                    tag_match_score=Count('id')  # Will be refined
                ).order_by('-view_count', '-published_at')[:limit]
                
                related_posts.extend(list(priority1))
            
            # Priority 2: Same category
            if len(related_posts) < limit and post.new_category:
                priority2 = BlogPost.objects.filter(
                    status='published',
                    published_at__lte=timezone.now(),
                    new_category=post.new_category
                ).exclude(id=post.id).exclude(id__in=[p.id for p in related_posts]).select_related('author', 'new_category')
                priority2 = priority2.order_by('-view_count', '-published_at')[:limit - len(related_posts)]
                related_posts.extend(list(priority2))
            
            # Priority 3: Matching tags
            if len(related_posts) < limit and post.tags:
                tag_queries = Q()
                for tag in post.tags:
                    tag_queries |= Q(tags__contains=[tag])
                
                priority3 = BlogPost.objects.filter(
                    status='published',
                    published_at__lte=timezone.now()
                ).filter(tag_queries).exclude(id=post.id).exclude(id__in=[p.id for p in related_posts]).select_related('author', 'new_category')
                priority3 = priority3.order_by('-view_count', '-published_at')[:limit - len(related_posts)]
                related_posts.extend(list(priority3))
            
            # Priority 4: Recent popular posts (fallback)
            if len(related_posts) < limit:
                priority4 = BlogPost.objects.filter(
                    status='published',
                    published_at__lte=timezone.now()
                ).exclude(id=post.id).exclude(id__in=[p.id for p in related_posts]).select_related('author', 'new_category')
                priority4 = priority4.order_by('-view_count', '-like_count', '-published_at')[:limit - len(related_posts)]
                related_posts.extend(list(priority4))
            
            # Remove duplicates and limit
            seen_ids = set()
            unique_posts = []
            for p in related_posts:
                if p.id not in seen_ids:
                    seen_ids.add(p.id)
                    unique_posts.append(p)
                if len(unique_posts) >= limit:
                    break
            
            cache.set(cache_key, unique_posts, 900)  # Cache for 15 minutes
            return unique_posts
        
        return cached_posts


class BlogInteractionService:
    """Service for blog post interactions (like, bookmark, share)."""
    
    @staticmethod
    @transaction.atomic
    def like_post(user: User, post: BlogPost, ip_address: str = None) -> Dict[str, Any]:
        """Like a blog post."""
        try:
            # Check if already liked
            existing_like = BlogPostLike.objects.filter(user=user, post=post).first()
            if existing_like:
                raise DuplicateActionError("Post already liked")
            
            # Create like
            like = BlogPostLike.objects.create(
                user=user,
                post=post,
                ip_address=ip_address
            )
            
            # Update post like count
            post.increment_like()
            
            # Clear related caches
            cache.delete(f"popular_posts_*")
            
            return {
                'success': True,
                'message': 'Post liked successfully',
                'like_count': post.like_count,
                'like_id': like.id
            }
            
        except Exception as e:
            raise BlogServiceError(f"Failed to like post: {str(e)}")
    
    @staticmethod
    @transaction.atomic
    def unlike_post(user: User, post: BlogPost) -> Dict[str, Any]:
        """Unlike a blog post."""
        try:
            existing_like = BlogPostLike.objects.filter(user=user, post=post).first()
            if not existing_like:
                raise BlogValidationError("Post not liked")
            
            existing_like.delete()
            post.decrement_like()
            
            # Clear related caches
            cache.delete(f"popular_posts_*")
            
            return {
                'success': True,
                'message': 'Post unliked successfully',
                'like_count': post.like_count
            }
            
        except Exception as e:
            raise BlogServiceError(f"Failed to unlike post: {str(e)}")
    
    @staticmethod
    @transaction.atomic
    def bookmark_post(user: User, post: BlogPost, ip_address: str = None) -> Dict[str, Any]:
        """Bookmark a blog post."""
        try:
            existing_bookmark = BlogPostBookmark.objects.filter(user=user, post=post).first()
            if existing_bookmark:
                raise DuplicateActionError("Post already bookmarked")
            
            bookmark = BlogPostBookmark.objects.create(
                user=user,
                post=post,
                ip_address=ip_address
            )
            
            post.increment_bookmark()
            
            return {
                'success': True,
                'message': 'Post bookmarked successfully',
                'bookmark_count': post.bookmark_count,
                'bookmark_id': bookmark.id
            }
            
        except Exception as e:
            raise BlogServiceError(f"Failed to bookmark post: {str(e)}")
    
    @staticmethod
    @transaction.atomic
    def unbookmark_post(user: User, post: BlogPost) -> Dict[str, Any]:
        """Unbookmark a blog post."""
        try:
            existing_bookmark = BlogPostBookmark.objects.filter(user=user, post=post).first()
            if not existing_bookmark:
                raise BlogValidationError("Post not bookmarked")
            
            existing_bookmark.delete()
            post.decrement_bookmark()
            
            return {
                'success': True,
                'message': 'Post unbookmarked successfully',
                'bookmark_count': post.bookmark_count
            }
            
        except Exception as e:
            raise BlogServiceError(f"Failed to unbookmark post: {str(e)}")
    
    @staticmethod
    @transaction.atomic
    def share_post(user: User, post: BlogPost, platform: str, ip_address: str = None) -> Dict[str, Any]:
        """Share a blog post."""
        try:
            share = BlogPostShare.objects.create(
                user=user,
                post=post,
                platform=platform,
                ip_address=ip_address
            )
            
            post.increment_share()
            
            return {
                'success': True,
                'message': 'Share recorded successfully',
                'share_count': post.share_count,
                'share_id': share.id
            }
            
        except Exception as e:
            raise BlogServiceError(f"Failed to record share: {str(e)}")
    
    @staticmethod
    def get_user_interactions(user: User) -> Dict[str, Any]:
        """Get user's blog interactions."""
        liked_posts = BlogPostLike.objects.filter(user=user).values_list('post', flat=True)
        bookmarked_posts = BlogPostBookmark.objects.filter(user=user).values_list('post', flat=True)
        
        return {
            'liked_posts': list(liked_posts),
            'bookmarked_posts': list(bookmarked_posts),
            'liked_count': len(liked_posts),
            'bookmarked_count': len(bookmarked_posts)
        }


class ReadingProgressService:
    """Service for reading progress operations."""
    
    @staticmethod
    @transaction.atomic
    def update_progress(
        user: User, 
        post: BlogPost, 
        progress_percentage: int,
        time_spent: int = 0,
        last_position: int = 0
    ) -> Dict[str, Any]:
        """Update user's reading progress."""
        try:
            if not (0 <= progress_percentage <= 100):
                raise BlogValidationError("Progress percentage must be between 0 and 100")
            
            progress, created = UserReadingProgress.objects.get_or_create(
                user=user,
                post=post,
                defaults={
                    'progress_percentage': progress_percentage,
                    'time_spent': time_spent,
                    'last_position': last_position,
                    'is_completed': progress_percentage >= 90
                }
            )
            
            if not created:
                progress.progress_percentage = progress_percentage
                progress.time_spent += time_spent
                progress.last_position = last_position
                progress.is_completed = progress_percentage >= 90
                
                if progress.is_completed and not progress.completed_at:
                    progress.completed_at = timezone.now()
                
                progress.save()
            
            return {
                'success': True,
                'message': 'Reading progress updated successfully',
                'progress_percentage': progress.progress_percentage,
                'is_completed': progress.is_completed,
                'time_spent': progress.time_spent
            }
            
        except Exception as e:
            raise BlogServiceError(f"Failed to update reading progress: {str(e)}")
    
    @staticmethod
    def get_user_reading_progress(user: User, limit: int = 10) -> List[UserReadingProgress]:
        """Get user's reading progress."""
        return UserReadingProgress.objects.filter(
            user=user
        ).select_related('post').order_by('-last_read_at')[:limit]
    
    @staticmethod
    def get_reading_analytics(user: User) -> Dict[str, Any]:
        """Get user's reading analytics."""
        progress_queryset = UserReadingProgress.objects.filter(user=user)
        
        total_posts_read = progress_queryset.count()
        completed_posts = progress_queryset.filter(is_completed=True).count()
        total_time_spent = progress_queryset.aggregate(
            total_time=Sum('time_spent')
        )['total_time'] or 0
        
        avg_progress = progress_queryset.aggregate(
            avg_progress=Avg('progress_percentage')
        )['avg_progress'] or 0
        
        return {
            'total_posts_read': total_posts_read,
            'completed_posts': completed_posts,
            'completion_rate': (completed_posts / total_posts_read * 100) if total_posts_read > 0 else 0,
            'total_time_spent': total_time_spent,
            'average_progress': round(avg_progress, 2)
        }


class BlogAnalyticsService:
    """Service for blog analytics and reporting."""
    
    @staticmethod
    def get_post_analytics(post: BlogPost) -> Dict[str, Any]:
        """Get analytics for a specific post."""
        likes_count = BlogPostLike.objects.filter(post=post).count()
        bookmarks_count = BlogPostBookmark.objects.filter(post=post).count()
        shares_count = BlogPostShare.objects.filter(post=post).count()
        comments_count = BlogPostComment.objects.filter(post=post, is_approved=True).count()
        
        # Reading progress analytics
        reading_progress = UserReadingProgress.objects.filter(post=post)
        total_readers = reading_progress.count()
        completed_readers = reading_progress.filter(is_completed=True).count()
        avg_progress = reading_progress.aggregate(
            avg_progress=Avg('progress_percentage')
        )['avg_progress'] or 0
        
        return {
            'likes': likes_count,
            'bookmarks': bookmarks_count,
            'shares': shares_count,
            'comments': comments_count,
            'total_readers': total_readers,
            'completed_readers': completed_readers,
            'completion_rate': (completed_readers / total_readers * 100) if total_readers > 0 else 0,
            'average_progress': round(avg_progress, 2)
        }
    
    @staticmethod
    def get_platform_analytics() -> Dict[str, Any]:
        """Get platform-wide analytics."""
        total_posts = BlogPost.objects.filter(status='published').count()
        total_likes = BlogPostLike.objects.count()
        total_bookmarks = BlogPostBookmark.objects.count()
        total_shares = BlogPostShare.objects.count()
        total_comments = BlogPostComment.objects.filter(is_approved=True).count()
        
        # Most popular posts
        popular_posts = BlogPost.objects.filter(
            status='published'
        ).annotate(
            total_engagement=Count('likes') + Count('bookmarks') + Count('shares')
        ).order_by('-total_engagement')[:5]
        
        return {
            'total_posts': total_posts,
            'total_likes': total_likes,
            'total_bookmarks': total_bookmarks,
            'total_shares': total_shares,
            'total_comments': total_comments,
            'popular_posts': [
                {
                    'id': post.id,
                    'title': post.title,
                    'slug': post.slug,
                    'engagement': post.total_engagement
                }
                for post in popular_posts
            ]
        }
