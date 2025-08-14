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
            'id', 'name', 'email', 'subject', 'message', 'phone', 
            'company', 'is_read', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_read', 'created_at', 'updated_at']


class ContactSubmissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating ContactSubmission."""
    
    class Meta:
        model = ContactSubmission
        fields = [
            'name', 'email', 'subject', 'message', 'phone', 'company'
        ]
    
    def create(self, validated_data):
        """Create a new contact submission."""
        return ContactSubmission.objects.create(**validated_data)
