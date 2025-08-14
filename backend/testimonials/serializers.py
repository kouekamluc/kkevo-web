"""
Serializers for testimonials app.
"""
from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for Testimonial model."""
    
    logo_url = serializers.ReadOnlyField()
    rating_stars = serializers.ReadOnlyField()
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client', 'company', 'quote', 'logo', 'logo_url', 
            'rating', 'rating_stars', 'is_active', 'order', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Testimonial list view."""
    
    logo_url = serializers.ReadOnlyField()
    rating_stars = serializers.ReadOnlyField()
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client', 'company', 'quote', 'logo_url', 
            'rating', 'rating_stars', 'is_active', 'order'
        ]
        read_only_fields = ['id', 'order', 'is_active']
