"""
Admin configuration for team app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import TeamMember


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    """Admin configuration for TeamMember model."""
    
    list_display = [
        'name', 'role', 'is_active', 'order', 'avatar_preview', 'created_at'
    ]
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['name', 'bio']
    list_editable = ['order', 'is_active']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'role', 'bio', 'is_active', 'order')
        }),
        ('Media', {
            'fields': ('avatar',)
        }),
        ('Social Links', {
            'fields': ('social_links',),
            'description': 'Enter social media links as JSON. Example: {"linkedin": "url", "github": "url"}'
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def avatar_preview(self, obj):
        """Display avatar preview in admin list."""
        if obj.avatar:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px; border-radius: 50%;" />',
                obj.avatar.url
            )
        return "No avatar"
    
    avatar_preview.short_description = 'Avatar Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request)
