from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import Resource, ResourceCategory, ResourceType, ResourceDownload, ResourceRating, ResourceView


class ResourceAdminForm(forms.ModelForm):
    """Custom form for Resource admin to handle JSONField properly."""
    
    class Meta:
        model = Resource
        fields = '__all__'
    
    def clean_tags(self):
        """Ensure tags field is always a valid JSON list."""
        tags = self.cleaned_data.get('tags')
        
        # If tags is empty string or None, return empty list
        if not tags or tags == '':
            return []
        
        # If tags is already a list, return as is
        if isinstance(tags, list):
            return tags
        
        # If tags is a string, try to parse it as comma-separated values
        if isinstance(tags, str):
            # Split by comma and clean up
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
            return tag_list
        
        # Fallback to empty list
        return []


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'order', 'is_active', 'resource_count']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']
    
    def resource_count(self, obj):
        return obj.resources.count()
    resource_count.short_description = 'Resources'


@admin.register(ResourceType)
class ResourceTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon', 'color', 'order', 'is_active', 'resource_count']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']
    
    def resource_count(self, obj):
        return obj.resources.count()
    resource_count.short_description = 'Resources'


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    form = ResourceAdminForm
    
    list_display = [
        'title', 'type', 'category', 'is_featured', 'is_premium', 
        'download_count', 'view_count', 'rating', 'is_active', 'published_at'
    ]
    list_filter = [
        'type', 'category', 'is_featured', 'is_premium', 'is_active', 
        'published_at', 'created_at'
    ]
    search_fields = ['title', 'description', 'tags', 'author']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = [
        'download_count', 'view_count', 'rating', 'rating_count',
        'created_at', 'updated_at'
    ]
    date_hierarchy = 'published_at'
    ordering = ['-is_featured', 'order', '-published_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'long_description', 'author')
        }),
        ('Categorization', {
            'fields': ('type', 'category', 'tags')
        }),
        ('Content Details', {
            'fields': ('file_size', 'format', 'estimated_time')
        }),
        ('Media', {
            'fields': ('thumbnail', 'file', 'external_url')
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_premium', 'order', 'is_active')
        }),
        ('Statistics', {
            'fields': ('download_count', 'view_count', 'rating', 'rating_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('published_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('type', 'category')


@admin.register(ResourceDownload)
class ResourceDownloadAdmin(admin.ModelAdmin):
    list_display = ['resource', 'user', 'ip_address', 'downloaded_at']
    list_filter = ['downloaded_at', 'resource__type', 'resource__category']
    search_fields = ['resource__title', 'user__username', 'ip_address']
    readonly_fields = ['downloaded_at']
    date_hierarchy = 'downloaded_at'
    ordering = ['-downloaded_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('resource', 'user')


@admin.register(ResourceRating)
class ResourceRatingAdmin(admin.ModelAdmin):
    list_display = ['resource', 'user', 'rating', 'comment_preview', 'created_at']
    list_filter = ['rating', 'created_at', 'resource__type', 'resource__category']
    search_fields = ['resource__title', 'user__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def comment_preview(self, obj):
        if obj.comment:
            return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
        return '-'
    comment_preview.short_description = 'Comment'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('resource', 'user')


@admin.register(ResourceView)
class ResourceViewAdmin(admin.ModelAdmin):
    list_display = ['resource', 'user', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at', 'resource__type', 'resource__category']
    search_fields = ['resource__title', 'user__username', 'ip_address']
    readonly_fields = ['viewed_at']
    date_hierarchy = 'viewed_at'
    ordering = ['-viewed_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('resource', 'user')




