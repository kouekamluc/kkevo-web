"""
Serializers for blog app.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.text import slugify
from .models import (
    BlogPost,
    BlogCategory,
    BlogPostView,
    BlogPostLike,
    BlogPostBookmark,
    BlogPostShare,
    BlogTag,
    BlogPostComment,
    UserReadingProgress,
    BlogPostAnalytics,
)


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'color', 'order', 'is_active']


class BlogPostListSerializer(serializers.ModelSerializer):
    # Return category as an object for frontend compatibility
    category = serializers.SerializerMethodField()
    # Also include category_name as string for backward compatibility
    category_name = serializers.CharField(source='category', read_only=True)
    
    def get_category(self, obj):
        """Return category object or default if none exists"""
        if obj.new_category:
            return BlogCategorySerializer(obj.new_category).data
        elif obj.category:  # Use the old category field
            # Create a default category object from the string
            return {
                'id': 'default',
                'name': obj.category.title(),
                'slug': obj.category.lower().replace(' ', '-'),
                'color': '#6B7280',
                'description': f'Category: {obj.category}',
                'order': 0,
                'is_active': True
            }
        else:
            # Return a default category
            return {
                'id': 'default',
                'name': 'General',
                'slug': 'general',
                'color': '#6B7280',
                'description': 'General category',
                'order': 0,
                'is_active': True
            }
    
    # Author object for frontend compatibility
    author = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'body', 'category', 'category_name', 'tags', 'author',
            'featured_image', 'published_at', 'is_featured', 'order',
            'view_count', 'like_count', 'bookmark_count', 'share_count', 'comment_count',
            'estimated_reading_time', 'word_count', 'created_at', 'updated_at'
        ]
    
    def get_author(self, obj):
        """Return author object for frontend compatibility"""
        if obj.author:
            # Handle avatar field properly
            avatar = None
            if hasattr(obj.author, 'avatar') and obj.author.avatar:
                try:
                    avatar = obj.author.avatar.url if obj.author.avatar else None
                except (ValueError, AttributeError):
                    avatar = None
            
            return {
                'id': str(obj.author.id),
                'name': obj.author.name,
                'role': obj.author.role,
                'avatar': avatar
            }
        return None


class BlogPostDetailSerializer(serializers.ModelSerializer):
    # Return category as an object for frontend compatibility
    category = serializers.SerializerMethodField()
    # Also include category_name as string for backward compatibility
    category_name = serializers.CharField(source='category', read_only=True)
    
    def get_category(self, obj):
        """Return category object or default if none exists"""
        if obj.new_category:
            return BlogCategorySerializer(obj.new_category).data
        elif obj.category:  # Use the old category field
            # Create a default category object from the string
            return {
                'id': 'default',
                'name': obj.category.title(),
                'slug': obj.category.lower().replace(' ', '-'),
                'color': '#6B7280',
                'description': f'Category: {obj.category}',
                'order': 0,
                'is_active': True
            }
        else:
            # Return a default category
            return {
                'id': 'default',
                'name': 'General',
                'slug': 'general',
                'color': '#6B7280',
                'description': 'General category',
                'order': 0,
                'is_active': True
            }
    
    # Author object for frontend compatibility
    author = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'body', 'category', 'category_name', 'tags', 'author',
            'featured_image', 'published_at', 'is_featured', 'order',
            'view_count', 'like_count', 'bookmark_count', 'share_count', 'comment_count',
            'estimated_reading_time', 'word_count', 'meta_title', 'meta_description',
            'created_at', 'updated_at'
        ]
    
    def get_author(self, obj):
        """Return author object for frontend compatibility"""
        if obj.author:
            # Handle avatar field properly
            avatar = None
            if hasattr(obj.author, 'avatar') and obj.author.avatar:
                try:
                    avatar = obj.author.avatar.url if obj.author.avatar else None
                except (ValueError, AttributeError):
                    avatar = None
            
            return {
                'id': str(obj.author.id),
                'name': obj.author.name,
                'role': obj.author.role,
                'avatar': avatar
            }
        return None


class BlogPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'body', 'category', 'tags',
            'featured_image', 'published_at', 'is_featured', 'order',
            'meta_title', 'meta_description'
        ]


class BlogPostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'title', 'excerpt', 'body', 'category', 'tags',
            'featured_image', 'published_at', 'is_featured', 'order',
            'meta_title', 'meta_description'
        ]


class BlogPostViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostView
        fields = ['id', 'post', 'user', 'ip_address', 'user_agent', 'referrer', 'viewed_at']
        read_only_fields = ['user', 'viewed_at']


class BlogPostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostLike
        fields = ['id', 'post', 'user', 'ip_address', 'liked_at']
        read_only_fields = ['user', 'liked_at']


class BlogPostBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostBookmark
        fields = ['id', 'post', 'user', 'ip_address', 'bookmarked_at']
        read_only_fields = ['user', 'bookmarked_at']


class BlogPostShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostShare
        fields = ['id', 'post', 'user', 'ip_address', 'platform', 'shared_at']
        read_only_fields = ['user', 'shared_at']


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug', 'color', 'created_at']


class BlogPostCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()
    is_reply = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPostComment
        fields = [
            'id', 'post', 'user', 'parent', 'content', 'is_approved', 
            'created_at', 'updated_at', 'reply_count', 'is_reply', 'replies'
        ]
        read_only_fields = ['user', 'is_approved', 'created_at', 'updated_at']
    
    def get_user(self, obj):
        """Return user info for frontend compatibility"""
        if obj.user:
            return {
                'id': str(obj.user.id),
                'username': obj.user.username,
                'first_name': getattr(obj.user, 'first_name', ''),
                'last_name': getattr(obj.user, 'last_name', ''),
                'email': getattr(obj.user, 'email', ''),
            }
        return None
    
    def get_reply_count(self, obj):
        """Get count of approved replies"""
        return obj.replies.filter(is_approved=True).count()
    
    def get_is_reply(self, obj):
        """Check if this comment is a reply"""
        return obj.parent is not None
    
    def get_replies(self, obj):
        """Get approved replies for this comment"""
        if obj.parent is None:  # Only show replies for top-level comments
            replies = obj.replies.filter(is_approved=True).order_by('created_at')
            return BlogPostCommentSerializer(replies, many=True, context=self.context).data
        return []


class UserReadingProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReadingProgress
        fields = [
            'id', 'user', 'post', 'progress_percentage', 'time_spent',
            'last_position', 'is_completed', 'completed_at', 'last_read_at'
        ]
        read_only_fields = ['user', 'completed_at', 'last_read_at']


class BlogPostAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostAnalytics
        fields = [
            'id', 'post', 'unique_views', 'returning_visitors', 'bounce_rate',
            'average_time_on_page', 'average_scroll_depth', 'completion_rate',
            'social_shares', 'social_clicks', 'search_impressions', 'search_clicks',
            'ctr', 'lead_generations', 'newsletter_signups', 'updated_at'
        ]
