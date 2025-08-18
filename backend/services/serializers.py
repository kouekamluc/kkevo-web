"""
Serializers for services app.
"""
from rest_framework import serializers
from .models import Service, CompanyStats


class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model."""
    
    icon_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_desc', 'long_desc', 
            'icon', 'icon_url', 'features', 'category', 'order', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ServiceListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Service list view."""
    
    icon_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_desc', 'icon_url', 
            'category', 'order', 'is_active'
        ]
        read_only_fields = ['id', 'slug', 'order', 'is_active']


class CompanyStatsSerializer(serializers.ModelSerializer):
    """Serializer for CompanyStats model."""
    
    display_value = serializers.ReadOnlyField()
    
    class Meta:
        model = CompanyStats
        fields = [
            'id', 'name', 'value', 'suffix', 'label', 'description',
            'icon_name', 'color_scheme', 'order', 'is_active',
            'created_at', 'updated_at', 'display_value'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
