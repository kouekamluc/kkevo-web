from rest_framework import serializers
from .models import Portfolio


class PortfolioSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Portfolio
        fields = [
            'id', 'title', 'slug', 'description', 'long_description',
            'category', 'client', 'year', 'hero_image', 'gallery_images',
            'technologies', 'duration', 'team_size', 'results',
            'live_url', 'github_url', 'case_study_url', 'is_featured',
            'order', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class PortfolioListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    
    class Meta:
        model = Portfolio
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'client', 'year', 'hero_image', 'technologies',
            'is_featured', 'order'
        ]
