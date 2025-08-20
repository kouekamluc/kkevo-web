from rest_framework import serializers
from .models import CaseStudy


class CaseStudyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    reading_time = serializers.ReadOnlyField()
    
    class Meta:
        model = CaseStudy
        fields = [
            'id', 'title', 'slug', 'subtitle', 'summary', 'category',
            'client_name', 'client_industry', 'project_duration',
            'technologies', 'hero_image', 'is_featured', 'order',
            'reading_time', 'created_at'
        ]


class CaseStudyDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detailed views"""
    reading_time = serializers.ReadOnlyField()
    has_metrics = serializers.ReadOnlyField()
    has_testimonial = serializers.ReadOnlyField()
    
    class Meta:
        model = CaseStudy
        fields = [
            'id', 'title', 'slug', 'subtitle', 'summary', 'description',
            'client_name', 'client_industry', 'client_size',
            'category', 'project_duration', 'team_size', 'budget_range',
            'challenge', 'solution', 'approach',
            'technologies', 'tools',
            'business_objectives', 'key_results', 'metrics', 'roi',
            'client_testimonial', 'client_contact_name', 'client_contact_role',
            'hero_image', 'gallery_images',
            'live_url', 'case_study_pdf',
            'is_featured', 'is_published', 'order',
            'reading_time', 'has_metrics', 'has_testimonial',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class CaseStudyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new case studies"""
    
    class Meta:
        model = CaseStudy
        fields = [
            'title', 'subtitle', 'summary', 'description',
            'client_name', 'client_industry', 'client_size',
            'category', 'project_duration', 'team_size', 'budget_range',
            'challenge', 'solution', 'approach',
            'technologies', 'tools',
            'business_objectives', 'key_results', 'metrics', 'roi',
            'client_testimonial', 'client_contact_name', 'client_contact_role',
            'hero_image', 'gallery_images',
            'live_url', 'case_study_pdf',
            'is_featured', 'is_published', 'order'
        ]

    def create(self, validated_data):
        # Set published_at if publishing
        if validated_data.get('is_published', False):
            from django.utils import timezone
            validated_data['published_at'] = timezone.now()
        
        return super().create(validated_data)
