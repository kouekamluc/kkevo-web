"""
Admin configuration for blog app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPost model."""
    
    list_display = [
        'title', 'author', 'status', 'is_featured', 'hero_image_preview', 'created_at'
    ]
    list_filter = ['status', 'is_featured', 'created_at', 'author']
    search_fields = ['title', 'summary', 'body', 'author__name']
    list_editable = ['status', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'summary', 'status', 'is_featured')
        }),
        ('Content', {
            'fields': ('body', 'hero_image')
        }),
        ('Author & Tags', {
            'fields': ('author', 'tags')
        }),
        ('Publishing', {
            'fields': ('published_at',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def hero_image_preview(self, obj):
        """Display hero image preview in admin list."""
        if obj.hero_image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px;" />',
                obj.hero_image.url
            )
        return "No image"
    
    hero_image_preview.short_description = 'Hero Image Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related('author')
    
    def save_model(self, request, obj, form, change):
        """Auto-set published_at when status changes to published."""
        if obj.status == 'published' and not obj.published_at:
            from django.utils import timezone
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)
