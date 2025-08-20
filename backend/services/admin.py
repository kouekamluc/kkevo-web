"""
Admin configuration for services app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Service, CompanyStats


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """Admin configuration for Service model."""
    
    list_display = [
        'title', 'category', 'order', 'is_active', 'is_featured', 'min_budget', 'max_budget', 'created_at', 'icon_preview'
    ]
    list_filter = ['category', 'is_active', 'is_featured', 'created_at']
    search_fields = ['title', 'short_desc', 'long_desc']
    list_editable = ['order', 'is_active', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'order', 'is_active', 'is_featured')
        }),
        ('Content', {
            'fields': ('short_desc', 'long_desc', 'icon')
        }),
        ('Business Logic', {
            'fields': (
                'pricing_tiers', 'timeline_estimates', 'budget_ranges',
                'min_budget', 'max_budget', 'complexity_levels', 'deliverables'
            ),
            'description': 'Business-critical information for sales and pricing'
        }),
        ('Business Metrics', {
            'fields': ('average_project_duration', 'success_rate'),
            'description': 'Performance and success metrics'
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
                '<img src="/media/icons/{}" style="max-height: 50px; max-width: 50px;" />',
                obj.icon
            )
        return "No icon"
    
    icon_preview.short_description = 'Icon Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related()


@admin.register(CompanyStats)
class CompanyStatsAdmin(admin.ModelAdmin):
    """Admin configuration for CompanyStats model."""
    
    list_display = [
        'name', 'value', 'suffix', 'label', 'order', 'is_active'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'label', 'description']
    list_editable = ['value', 'suffix', 'order', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'value', 'suffix', 'label', 'description')
        }),
        ('Display', {
            'fields': ('icon_name', 'color_scheme', 'order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related()
