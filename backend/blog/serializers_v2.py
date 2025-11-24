"""
Enhanced serializers for blog app with proper validation and business logic.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from typing import Dict, Any, List

from .models import (
    BlogPost, BlogCategory, BlogPostView, BlogPostLike, 
    BlogPostBookmark, BlogPostShare, BlogTag, BlogPostComment,
    UserReadingProgress, BlogPostAnalytics
)
from team.models import TeamMember
from .exceptions import BlogValidationError

User = get_user_model()


class BlogCategorySerializer(serializers.ModelSerializer):
    """Serializer for blog categories."""
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogCategory
        fields = [
            'id', 'name', 'slug', 'description', 'color', 
            'order', 'is_active', 'post_count'
        ]
        read_only_fields = ['id', 'slug', 'post_count']
    
    def get_post_count(self, obj):
        """Get count of published posts in this category."""
        return obj.posts.filter(status='published').count()
    
    def validate_name(self, value):
        """Validate category name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters long.")
        return value.strip()
    
    def validate_color(self, value):
        """Validate color format."""
        if not value.startswith('#'):
            raise serializers.ValidationError("Color must be a valid hex color code starting with #.")
        if len(value) != 7:
            raise serializers.ValidationError("Color must be a 6-digit hex code.")
        return value.upper()


class BlogTagSerializer(serializers.ModelSerializer):
    """Serializer for blog tags."""
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug', 'color', 'post_count', 'created_at']
        read_only_fields = ['id', 'slug', 'post_count', 'created_at']
    
    def get_post_count(self, obj):
        """Get count of posts using this tag."""
        return BlogPost.objects.filter(
            status='published',
            tags__contains=[obj.name]
        ).count()
    
    def validate_name(self, value):
        """Validate tag name."""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Tag name must be at least 2 characters long.")
        return value.strip().lower()


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for blog post authors (TeamMember)."""
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'avatar_url']
    
    def get_avatar_url(self, obj):
        """Get author avatar URL."""
        if hasattr(obj, 'avatar') and obj.avatar:
            try:
                return obj.avatar.url
            except (ValueError, AttributeError):
                return None
        return None


class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for blog post list view."""
    author = AuthorSerializer(read_only=True)
    category = BlogCategorySerializer(read_only=True)
    tags = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()
    engagement_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'author', 'category', 'tags', 'status', 'is_featured',
            'published_at', 'created_at', 'updated_at',
            'view_count', 'like_count', 'bookmark_count', 'share_count',
            'comment_count', 'reading_time', 'engagement_stats'
        ]
        read_only_fields = [
            'id', 'slug', 'author', 'created_at', 'updated_at',
            'view_count', 'like_count', 'bookmark_count', 'share_count',
            'comment_count', 'reading_time', 'engagement_stats'
        ]
    
    def get_tags(self, obj):
        """Get formatted tags."""
        if obj.tags:
            return [{'name': tag, 'slug': slugify(tag)} for tag in obj.tags]
        return []
    
    def get_reading_time(self, obj):
        """Get estimated reading time."""
        return obj.estimated_reading_time
    
    def get_engagement_stats(self, obj):
        """Get engagement statistics."""
        return {
            'total_engagement': obj.like_count + obj.bookmark_count + obj.share_count,
            'engagement_rate': self._calculate_engagement_rate(obj)
        }
    
    def _calculate_engagement_rate(self, obj):
        """Calculate engagement rate."""
        if obj.view_count == 0:
            return 0
        total_engagement = obj.like_count + obj.bookmark_count + obj.share_count
        return round((total_engagement / obj.view_count) * 100, 2)


class BlogPostDetailSerializer(BlogPostListSerializer):
    """Serializer for blog post detail view."""
    body = serializers.CharField()
    meta_title = serializers.CharField()
    meta_description = serializers.CharField()
    related_posts = serializers.SerializerMethodField()
    user_interactions = serializers.SerializerMethodField()
    
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + [
            'body', 'meta_title', 'meta_description', 'related_posts', 'user_interactions'
        ]
    
    def get_related_posts(self, obj):
        """Get related posts."""
        from .services import BlogPostService
        related = BlogPostService.get_related_posts(obj, limit=3)
        return BlogPostListSerializer(related, many=True, context=self.context).data
    
    def get_user_interactions(self, obj):
        """Get user's interactions with this post."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            return {
                'is_liked': BlogPostLike.objects.filter(user=user, post=obj).exists(),
                'is_bookmarked': BlogPostBookmark.objects.filter(user=user, post=obj).exists(),
                'reading_progress': self._get_reading_progress(user, obj)
            }
        return {
            'is_liked': False,
            'is_bookmarked': False,
            'reading_progress': None
        }
    
    def _get_reading_progress(self, user, post):
        """Get user's reading progress for this post."""
        try:
            progress = UserReadingProgress.objects.get(user=user, post=post)
            return {
                'progress_percentage': progress.progress_percentage,
                'time_spent': progress.time_spent,
                'is_completed': progress.is_completed,
                'last_read_at': progress.last_read_at
            }
        except UserReadingProgress.DoesNotExist:
            return None


class BlogPostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating blog posts."""
    
    class Meta:
        model = BlogPost
        fields = [
            'title', 'excerpt', 'body', 'featured_image', 'category',
            'tags', 'is_featured', 'meta_title', 'meta_description'
        ]
    
    def validate_title(self, value):
        """Validate post title."""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value.strip()
    
    def validate_excerpt(self, value):
        """Validate post excerpt."""
        if len(value.strip()) < 20:
            raise serializers.ValidationError("Excerpt must be at least 20 characters long.")
        return value.strip()
    
    def validate_body(self, value):
        """Validate post body."""
        if len(value.strip()) < 100:
            raise serializers.ValidationError("Post body must be at least 100 characters long.")
        return value.strip()
    
    def validate_tags(self, value):
        """Validate tags."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        
        if len(value) > 10:
            raise serializers.ValidationError("Maximum 10 tags allowed.")
        
        for tag in value:
            if not isinstance(tag, str) or len(tag.strip()) < 2:
                raise serializers.ValidationError("Each tag must be at least 2 characters long.")
        
        return [tag.strip().lower() for tag in value]
    
    def create(self, validated_data):
        """Create a new blog post."""
        validated_data['author'] = self.context['request'].user
        validated_data['slug'] = slugify(validated_data['title'])
        
        # Set published_at if status is published
        if validated_data.get('status') == 'published':
            validated_data['published_at'] = timezone.now()
        
        return super().create(validated_data)


class BlogPostUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating blog posts."""
    
    class Meta:
        model = BlogPost
        fields = [
            'title', 'excerpt', 'body', 'featured_image', 'category',
            'tags', 'status', 'is_featured', 'meta_title', 'meta_description'
        ]
    
    def validate_title(self, value):
        """Validate post title."""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value.strip()
    
    def update(self, instance, validated_data):
        """Update blog post."""
        # Update slug if title changed
        if 'title' in validated_data and validated_data['title'] != instance.title:
            validated_data['slug'] = slugify(validated_data['title'])
        
        # Set published_at if status changed to published
        if validated_data.get('status') == 'published' and instance.status != 'published':
            validated_data['published_at'] = timezone.now()
        
        return super().update(instance, validated_data)


class BlogPostLikeSerializer(serializers.ModelSerializer):
    """Serializer for blog post likes."""
    user = AuthorSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)
    
    class Meta:
        model = BlogPostLike
        fields = ['id', 'user', 'post', 'post_title', 'ip_address', 'liked_at']
        read_only_fields = ['id', 'user', 'liked_at']


class BlogPostBookmarkSerializer(serializers.ModelSerializer):
    """Serializer for blog post bookmarks."""
    user = AuthorSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)
    
    class Meta:
        model = BlogPostBookmark
        fields = ['id', 'user', 'post', 'post_title', 'ip_address', 'bookmarked_at']
        read_only_fields = ['id', 'user', 'bookmarked_at']


class BlogPostShareSerializer(serializers.ModelSerializer):
    """Serializer for blog post shares."""
    user = AuthorSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = BlogPostShare
        fields = [
            'id', 'user', 'post', 'post_title', 'platform', 
            'platform_display', 'ip_address', 'shared_at'
        ]
        read_only_fields = ['id', 'user', 'shared_at']
    
    def validate_platform(self, value):
        """Validate platform choice."""
        valid_platforms = [choice[0] for choice in BlogPostShare.SHARE_PLATFORMS]
        if value not in valid_platforms:
            raise serializers.ValidationError(f"Invalid platform. Choose from: {', '.join(valid_platforms)}")
        return value


class BlogPostCommentSerializer(serializers.ModelSerializer):
    """Serializer for blog post comments."""
    user = AuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPostComment
        fields = [
            'id', 'user', 'post', 'parent', 'content', 'is_approved',
            'is_moderated', 'replies', 'reply_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'is_approved', 'is_moderated', 
            'replies', 'reply_count', 'created_at', 'updated_at'
        ]
    
    def get_replies(self, obj):
        """Get approved replies."""
        replies = obj.replies.filter(is_approved=True).order_by('created_at')
        return BlogPostCommentSerializer(replies, many=True, context=self.context).data
    
    def get_reply_count(self, obj):
        """Get count of approved replies."""
        return obj.replies.filter(is_approved=True).count()
    
    def validate_content(self, value):
        """Validate comment content."""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Comment must be at least 5 characters long.")
        if len(value.strip()) > 1000:
            raise serializers.ValidationError("Comment must be less than 1000 characters.")
        return value.strip()
    
    def create(self, validated_data):
        """Create a new comment."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserReadingProgressSerializer(serializers.ModelSerializer):
    """Serializer for user reading progress."""
    user = AuthorSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)
    post_slug = serializers.CharField(source='post.slug', read_only=True)
    
    class Meta:
        model = UserReadingProgress
        fields = [
            'id', 'user', 'post', 'post_title', 'post_slug',
            'progress_percentage', 'time_spent', 'last_position',
            'is_completed', 'completed_at', 'last_read_at', 'created_at'
        ]
        read_only_fields = [
            'id', 'user', 'completed_at', 'last_read_at', 'created_at'
        ]
    
    def validate_progress_percentage(self, value):
        """Validate progress percentage."""
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Progress percentage must be between 0 and 100.")
        return value
    
    def validate_time_spent(self, value):
        """Validate time spent."""
        if value < 0:
            raise serializers.ValidationError("Time spent cannot be negative.")
        return value
    
    def create(self, validated_data):
        """Create reading progress."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BlogAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for blog analytics."""
    post_title = serializers.CharField(source='post.title', read_only=True)
    post_slug = serializers.CharField(source='post.slug', read_only=True)
    
    class Meta:
        model = BlogPostAnalytics
        fields = [
            'id', 'post', 'post_title', 'post_slug',
            'unique_views', 'returning_visitors', 'bounce_rate',
            'average_time_on_page', 'average_scroll_depth', 'completion_rate',
            'social_shares', 'social_clicks', 'search_impressions',
            'search_clicks', 'ctr', 'lead_generations', 'newsletter_signups',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class BlogInteractionRequestSerializer(serializers.Serializer):
    """Serializer for blog interaction requests."""
    action = serializers.ChoiceField(choices=['like', 'unlike', 'bookmark', 'unbookmark'])
    platform = serializers.ChoiceField(
        choices=[choice[0] for choice in BlogPostShare.SHARE_PLATFORMS],
        required=False
    )
    
    def validate(self, data):
        """Validate interaction request."""
        action = data.get('action')
        platform = data.get('platform')
        
        if action in ['share'] and not platform:
            raise serializers.ValidationError("Platform is required for share action.")
        
        return data


class ReadingProgressRequestSerializer(serializers.Serializer):
    """Serializer for reading progress requests."""
    progress_percentage = serializers.IntegerField(min_value=0, max_value=100)
    time_spent = serializers.IntegerField(min_value=0, default=0)
    last_position = serializers.IntegerField(min_value=0, default=0)
    
    def validate(self, data):
        """Validate reading progress data."""
        progress = data.get('progress_percentage', 0)
        time_spent = data.get('time_spent', 0)
        
        if progress > 0 and time_spent == 0:
            raise serializers.ValidationError("Time spent must be greater than 0 when progress is recorded.")
        
        return data
