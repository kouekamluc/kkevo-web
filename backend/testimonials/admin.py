"""
Admin configuration for testimonials app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """Admin configuration for Testimonial model."""
    
    list_display = [
        'client', 'company', 'rating', 'is_active', 'order', 'logo_preview', 'created_at'
    ]
    list_filter = ['rating', 'is_active', 'created_at']
    search_fields = ['client', 'company', 'quote']
    list_editable = ['order', 'is_active']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('client', 'company', 'quote', 'rating', 'is_active', 'order')
        }),
        ('Media', {
            'fields': ('logo',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def logo_preview(self, obj):
        """Display logo preview in admin list."""
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px;" />',
                obj.logo.url
            )
        return "No logo"
    
    logo_preview.short_description = 'Logo Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request)
