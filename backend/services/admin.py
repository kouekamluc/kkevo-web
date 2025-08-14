"""
Admin configuration for services app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """Admin configuration for Service model."""
    
    list_display = [
        'title', 'category', 'order', 'is_active', 'created_at', 'icon_preview'
    ]
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title', 'short_desc', 'long_desc']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'order', 'is_active')
        }),
        ('Content', {
            'fields': ('short_desc', 'long_desc', 'icon')
        }),
        ('Features', {
            'fields': ('features',),
            'description': 'Enter features as a JSON array. Example: ["Feature 1", "Feature 2"]'
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def icon_preview(self, obj):
        """Display icon preview in admin list."""
        if obj.icon:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px;" />',
                obj.icon.url
            )
        return "No icon"
    
    icon_preview.short_description = 'Icon Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related()
