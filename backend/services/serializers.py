"""
Serializers for services app.
"""
from rest_framework import serializers
from .models import Service, CompanyStats, CompanyConfig


class CompanyConfigSerializer(serializers.ModelSerializer):
    """Serializer for CompanyConfig model."""
    
    class Meta:
        model = CompanyConfig
        fields = [
            'hero_headline', 'hero_subtitle', 'hero_features',
            'cta_headline', 'cta_subtitle', 'cta_benefits',
            'company_phone', 'company_email', 'company_address', 'live_chat_enabled',
            'trust_companies', 'linkedin_url', 'twitter_url', 'github_url'
        ]


class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model."""
    
    icon_url = serializers.ReadOnlyField()
    display_budget_range = serializers.ReadOnlyField()
    display_timeline = serializers.ReadOnlyField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_desc', 'long_desc', 
            'icon', 'icon_url', 'features', 'category', 'order', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Comprehensive serializer for Service detail view."""
    
    icon_url = serializers.ReadOnlyField()
    display_budget_range = serializers.ReadOnlyField()
    display_timeline = serializers.ReadOnlyField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_desc', 'long_desc', 
            'icon', 'icon_url', 'features', 'category', 'order', 
            'is_active', 'is_featured', 'created_at', 'updated_at',
            'pricing_tiers', 'timeline_estimates', 'budget_ranges',
            'min_budget', 'max_budget', 'complexity_levels', 'deliverables',
            'average_project_duration', 'success_rate', 'display_budget_range',
            'display_timeline'
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
