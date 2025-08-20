"""
Serializers for contact app.
"""
from rest_framework import serializers
from .models import ContactSubmission


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for ContactSubmission model."""

    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'name', 'email', 'phone', 'company', 'subject', 'message',
            'project_budget', 'timeline', 'team_size', 'industry', 'urgency',
            'lead_score', 'status', 'assigned_to', 'notes', 'source',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'submitted_at', 'first_contacted_at', 'last_contacted_at',
            'follow_up_scheduled', 'follow_up_completed', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'lead_score', 'status', 'assigned_to', 'submitted_at',
            'first_contacted_at', 'last_contacted_at', 'follow_up_scheduled',
            'follow_up_completed', 'created_at', 'updated_at'
        ]


class ContactSubmissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new contact submissions."""

    class Meta:
        model = ContactSubmission
        fields = [
            'name', 'email', 'phone', 'company', 'subject', 'message',
            'project_budget', 'timeline', 'team_size', 'industry', 'urgency',
            'source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'
        ]

    def create(self, validated_data):
        """Create a new contact submission with automatic lead scoring."""
        # Set default source if not provided
        validated_data.setdefault('source', 'website')
        
        # Create the submission (lead score will be calculated automatically in save method)
        submission = ContactSubmission.objects.create(**validated_data)
        
        return submission


class ContactSubmissionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating contact submissions."""

    class Meta:
        model = ContactSubmission
        fields = [
            'status', 'lead_score', 'assigned_to', 'notes',
            'follow_up_scheduled', 'follow_up_completed'
        ]

    def update(self, instance, validated_data):
        """Update the contact submission."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # If lead score is being updated manually, save it
        if 'lead_score' in validated_data:
            instance.save(update_fields=['lead_score', 'updated_at'])
        else:
            instance.save()
        
        return instance


class ContactSubmissionListSerializer(serializers.ModelSerializer):
    """Serializer for listing contact submissions (summary view)."""

    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    time_since_submission = serializers.SerializerMethodField()
    is_high_priority = serializers.BooleanField(read_only=True)
    is_qualified = serializers.BooleanField(read_only=True)
    needs_follow_up = serializers.BooleanField(read_only=True)

    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'name', 'email', 'company', 'subject', 'lead_score', 'status',
            'assigned_to_name', 'submitted_at', 'time_since_submission',
            'is_high_priority', 'is_qualified', 'needs_follow_up'
        ]

    def get_time_since_submission(self, obj):
        """Get human-readable time since submission."""
        delta = obj.time_since_submission
        days = delta.days
        
        if days == 0:
            hours = delta.seconds // 3600
            if hours == 0:
                minutes = delta.seconds // 60
                return f"{minutes}m ago"
            return f"{hours}h ago"
        elif days == 1:
            return "1 day ago"
        else:
            return f"{days} days ago"


class ContactAnalyticsSerializer(serializers.Serializer):
    """Serializer for contact analytics data."""

    total_submissions = serializers.IntegerField()
    new_leads = serializers.IntegerField()
    qualified_leads = serializers.IntegerField()
    high_priority_leads = serializers.IntegerField()
    needs_follow_up = serializers.IntegerField()
    avg_lead_score = serializers.FloatField()
    
    # Status breakdown
    status_breakdown = serializers.DictField()
    
    # Subject breakdown
    subject_breakdown = serializers.DictField()
    
    # Industry breakdown
    industry_breakdown = serializers.DictField()
    
    # Timeline trends
    daily_submissions = serializers.ListField()
    weekly_submissions = serializers.ListField()
    monthly_submissions = serializers.ListField()


class ContactDashboardStatsSerializer(serializers.Serializer):
    """Serializer for contact dashboard statistics."""

    today_submissions = serializers.IntegerField()
    week_submissions = serializers.IntegerField()
    month_submissions = serializers.IntegerField()
    pending_follow_ups = serializers.IntegerField()
    high_value_leads = serializers.IntegerField()
    avg_response_time = serializers.FloatField()
    conversion_rate = serializers.FloatField()
