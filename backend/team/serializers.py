"""
Serializers for team app.
"""
from rest_framework import serializers
from .models import TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer for TeamMember model."""
    
    avatar_url = serializers.ReadOnlyField()
    role_display = serializers.ReadOnlyField(source='get_role_display')
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'role_display', 'bio', 'avatar', 
            'avatar_url', 'social_links', 'is_active', 'order', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TeamMemberListSerializer(serializers.ModelSerializer):
    """Simplified serializer for TeamMember list view."""
    
    avatar_url = serializers.ReadOnlyField()
    role_display = serializers.ReadOnlyField(source='get_role_display')
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'role_display', 'bio', 
            'avatar_url', 'social_links', 'is_active', 'order'
        ]
        read_only_fields = ['id', 'order', 'is_active']
