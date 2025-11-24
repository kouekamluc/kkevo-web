from rest_framework import serializers
from .models import Resource, ResourceCategory, ResourceType, ResourceDownload, ResourceRating, ResourceView


class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = ['id', 'name', 'slug', 'color', 'description', 'order', 'is_active']


class ResourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceType
        fields = ['id', 'name', 'slug', 'icon', 'color', 'description', 'order', 'is_active']


class ResourceListSerializer(serializers.ModelSerializer):
    type = ResourceTypeSerializer(read_only=True)
    category = ResourceCategorySerializer(read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'slug', 'description', 'type', 'category', 'tags',
            'file_size', 'format', 'estimated_time', 'thumbnail', 'external_url',
            'author', 'is_featured', 'is_premium', 'order', 'is_active',
            'download_count', 'view_count', 'rating', 'rating_count',
            'created_at', 'updated_at', 'published_at'
        ]


class ResourceDetailSerializer(serializers.ModelSerializer):
    type = ResourceTypeSerializer(read_only=True)
    category = ResourceCategorySerializer(read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'slug', 'description', 'long_description', 'type', 'category', 'tags',
            'file_size', 'format', 'estimated_time', 'thumbnail', 'file', 'external_url',
            'author', 'is_featured', 'is_premium', 'order', 'is_active',
            'download_count', 'view_count', 'rating', 'rating_count',
            'created_at', 'updated_at', 'published_at'
        ]


class ResourceDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceDownload
        fields = ['id', 'resource', 'user', 'ip_address', 'user_agent', 'referrer', 'downloaded_at']
        read_only_fields = ['user', 'downloaded_at']


class ResourceRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceRating
        fields = ['id', 'resource', 'user', 'ip_address', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class ResourceViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceView
        fields = ['id', 'resource', 'user', 'ip_address', 'user_agent', 'referrer', 'viewed_at']
        read_only_fields = ['user', 'viewed_at']


class ResourceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            'title', 'slug', 'description', 'long_description', 'type', 'category', 'tags',
            'file_size', 'format', 'estimated_time', 'thumbnail', 'file', 'external_url',
            'author', 'is_featured', 'is_premium', 'order', 'is_active'
        ]


class ResourceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            'title', 'description', 'long_description', 'type', 'category', 'tags',
            'file_size', 'format', 'estimated_time', 'thumbnail', 'file', 'external_url',
            'author', 'is_featured', 'is_premium', 'order', 'is_active'
        ]








