"""
Serializers for lead magnets app.
"""
from rest_framework import serializers
from .models import LeadMagnetSubmission


class LeadMagnetSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for LeadMagnetSubmission model."""
    
    class Meta:
        model = LeadMagnetSubmission
        fields = [
            'id', 'name', 'email', 'company', 'role', 'lead_magnet_type',
            'source', 'form_submitted_at', 'pdf_downloaded_at', 'email_sent_at',
            'email_opened_at', 'is_subscribed_to_newsletter', 'follow_up_scheduled',
            'follow_up_completed', 'utm_source', 'utm_medium', 'utm_campaign',
            'utm_term', 'utm_content', 'notes', 'lead_score', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'form_submitted_at', 'pdf_downloaded_at', 'email_sent_at',
            'email_opened_at', 'created_at', 'updated_at'
        ]


class LeadMagnetSubmissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new lead magnet submissions."""
    
    class Meta:
        model = LeadMagnetSubmission
        fields = [
            'name', 'email', 'company', 'role', 'lead_magnet_type',
            'source', 'utm_source', 'utm_medium', 'utm_campaign',
            'utm_term', 'utm_content'
        ]
    
    def create(self, validated_data):
        """Create a new lead magnet submission."""
        # Set default values
        validated_data.setdefault('lead_magnet_type', 'django-saas-checklist')
        validated_data.setdefault('source', 'website')
        
        # Create the submission
        submission = LeadMagnetSubmission.objects.create(**validated_data)
        
        # Calculate initial lead score based on provided information
        lead_score = 0
        
        if submission.company:
            lead_score += 10
        
        if submission.role in ['founder', 'ceo', 'cto']:
            lead_score += 20
        elif submission.role in ['developer', 'product-manager']:
            lead_score += 15
        
        if submission.utm_source:
            lead_score += 5
        
        if submission.utm_campaign:
            lead_score += 5
        
        # Update lead score
        submission.update_lead_score(lead_score)
        
        return submission


class LeadMagnetSubmissionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating lead magnet submissions."""
    
    class Meta:
        model = LeadMagnetSubmission
        fields = [
            'status', 'lead_score', 'notes', 'follow_up_scheduled',
            'follow_up_completed', 'is_subscribed_to_newsletter'
        ]
    
    def update(self, instance, validated_data):
        """Update the lead magnet submission."""
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # If lead score is being updated, also update status
        if 'lead_score' in validated_data:
            instance.update_lead_score(validated_data['lead_score'])
        else:
            instance.save()
        
        return instance
