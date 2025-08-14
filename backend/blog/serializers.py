"""
Serializers for blog app.
"""
from rest_framework import serializers
from .models import BlogPost
from team.serializers import TeamMemberListSerializer


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for BlogPost model."""
    
    hero_image_url = serializers.ReadOnlyField()
    author_name = serializers.ReadOnlyField()
    author_role = serializers.ReadOnlyField()
    author_avatar = serializers.ReadOnlyField()
    reading_time = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'summary', 'body', 'hero_image', 
            'hero_image_url', 'author', 'author_name', 'author_role', 
            'author_avatar', 'tags', 'status', 'published_at', 
            'is_featured', 'reading_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class BlogPostListSerializer(serializers.ModelSerializer):
    """Simplified serializer for BlogPost list view."""
    
    hero_image_url = serializers.ReadOnlyField()
    author_name = serializers.ReadOnlyField()
    author_role = serializers.ReadOnlyField()
    reading_time = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'summary', 'hero_image_url', 
            'author_name', 'author_role', 'tags', 'status', 
            'published_at', 'is_featured', 'reading_time'
        ]
        read_only_fields = ['id', 'slug', 'status', 'published_at', 'is_featured']


class BlogPostDetailSerializer(BlogPostSerializer):
    """Detailed serializer for BlogPost detail view."""
    
    author = TeamMemberListSerializer(read_only=True)
