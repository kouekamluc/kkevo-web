"""
Admin configuration for services app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import Service, CompanyStats, CompanyConfig


class ServiceAdminForm(forms.ModelForm):
    """Custom form for Service admin to handle JSONField properly."""
    
    class Meta:
        model = Service
        fields = '__all__'
    
    def clean_json_field(self, field_name):
        """Generic method to clean JSONField values."""
        value = self.cleaned_data.get(field_name)
        
        # If value is empty string or None, return appropriate default
        if not value or value == '':
            if field_name in ['features', 'complexity_levels', 'deliverables']:
                return []
            elif field_name in ['pricing_tiers', 'timeline_estimates', 'budget_ranges']:
                return {}
            return value
        
        # If value is already the correct type, return as is
        if field_name in ['features', 'complexity_levels', 'deliverables']:
            if isinstance(value, list):
                return value
            elif isinstance(value, str):
                # Split by comma and clean up
                return [item.strip() for item in value.split(',') if item.strip()]
        elif field_name in ['pricing_tiers', 'timeline_estimates', 'budget_ranges']:
            if isinstance(value, dict):
                return value
            elif isinstance(value, str):
                # Try to parse as JSON
                try:
                    import json
                    return json.loads(value)
                except (json.JSONDecodeError, ValueError):
                    # Fallback to empty dict
                    return {}
        
        return value
    
    def clean_features(self):
        return self.clean_json_field('features')
    
    def clean_pricing_tiers(self):
        return self.clean_json_field('pricing_tiers')
    
    def clean_timeline_estimates(self):
        return self.clean_json_field('timeline_estimates')
    
    def clean_budget_ranges(self):
        return self.clean_json_field('budget_ranges')
    
    def clean_complexity_levels(self):
        return self.clean_json_field('complexity_levels')
    
    def clean_deliverables(self):
        return self.clean_json_field('deliverables')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """Admin configuration for Service model."""
    
    form = ServiceAdminForm
    
    list_display = [
        'title', 'category', 'order', 'is_active', 'is_featured', 'min_budget', 'max_budget', 'created_at', 'icon_preview', 'image_preview'
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
            'fields': ('short_desc', 'long_desc', 'icon', 'image', 'image_alt')
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
    
    def image_preview(self, obj):
        """Display image preview in admin list."""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px;" alt="{}" />',
                obj.image.url, obj.image_alt or obj.title
            )
        return "No image"
    
    image_preview.short_description = 'Image Preview'
    
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


@admin.register(CompanyConfig)
class CompanyConfigAdmin(admin.ModelAdmin):
    """Admin configuration for CompanyConfig model."""
    
    list_display = ['is_active', 'company_email', 'company_phone', 'updated_at']
    list_display_links = ['company_email']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_headline', 'hero_subtitle', 'hero_features'),
            'description': 'Configure the main hero section content'
        }),
        ('CTA Section', {
            'fields': ('cta_headline', 'cta_subtitle', 'cta_benefits'),
            'description': 'Configure call-to-action section content'
        }),
        ('Contact Information', {
            'fields': ('company_phone', 'company_email', 'company_address', 'live_chat_enabled'),
            'description': 'Company contact details displayed throughout the site'
        }),
        ('Trust & Social', {
            'fields': ('trust_companies', 'linkedin_url', 'twitter_url', 'github_url'),
            'description': 'Trust indicators and social media links'
        }),
        ('Status', {
            'fields': ('is_active',),
            'description': 'Only one configuration should be active at a time'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Ensure only one configuration is active at a time."""
        if obj.is_active:
            # Deactivate all other configurations
            CompanyConfig.objects.exclude(id=obj.id).update(is_active=False)
        super().save_model(request, obj, form, change)
    
    def has_add_permission(self, request):
        """Only allow one configuration instance."""
        if CompanyConfig.objects.exists():
            return False
        return super().has_add_permission(request)
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of the only configuration."""
        if CompanyConfig.objects.count() <= 1:
            return False
        return super().has_delete_permission(request, obj)
