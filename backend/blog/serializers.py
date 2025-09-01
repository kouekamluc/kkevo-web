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
)


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'color', 'order', 'is_active']


class BlogPostListSerializer(serializers.ModelSerializer):
    # Return category as an object for frontend compatibility
    category = BlogCategorySerializer(source='new_category', read_only=True)
    # Also include category_name as string for backward compatibility
    category_name = serializers.CharField(source='category', read_only=True)
    
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
    category = BlogCategorySerializer(source='new_category', read_only=True)
    # Also include category_name as string for backward compatibility
    category_name = serializers.CharField(source='category', read_only=True)
    
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
