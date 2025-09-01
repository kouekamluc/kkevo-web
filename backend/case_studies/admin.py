from django.contrib import admin
from django import forms
from .models import CaseStudy


class CaseStudyAdminForm(forms.ModelForm):
    """Custom form for CaseStudy admin to handle JSONField properly."""
    
    class Meta:
        model = CaseStudy
        fields = '__all__'
    
    def clean_json_field(self, field_name):
        """Generic method to clean JSONField values."""
        value = self.cleaned_data.get(field_name)
        
        # If value is empty string or None, return appropriate default
        if not value or value == '':
            if field_name in ['technologies', 'tools', 'business_objectives', 'key_results', 'gallery_images']:
                return []
            elif field_name in ['metrics']:
                return {}
            return value
        
        # If value is already the correct type, return as is
        if field_name in ['technologies', 'tools', 'business_objectives', 'key_results', 'gallery_images']:
            if isinstance(value, list):
                return value
            elif isinstance(value, str):
                # Split by comma and clean up
                return [item.strip() for item in value.split(',') if item.strip()]
        elif field_name in ['metrics']:
            if isinstance(value, dict):
                return value
            elif isinstance(value, str):
                # Try to parse as JSON or key-value pairs
                try:
                    import json
                    return json.loads(value)
                except (json.JSONDecodeError, ValueError):
                    # Fallback to empty dict
                    return {}
        
        return value
    
    def clean_technologies(self):
        return self.clean_json_field('technologies')
    
    def clean_tools(self):
        return self.clean_json_field('tools')
    
    def clean_business_objectives(self):
        return self.clean_json_field('business_objectives')
    
    def clean_key_results(self):
        return self.clean_json_field('key_results')
    
    def clean_metrics(self):
        return self.clean_json_field('metrics')
    
    def clean_gallery_images(self):
        return self.clean_json_field('gallery_images')


@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    form = CaseStudyAdminForm
    
    list_display = [
        'title', 'client_name', 'category', 'client_industry', 
        'is_featured', 'is_published', 'order', 'created_at'
    ]
    list_filter = [
        'category', 'client_industry', 'is_featured', 'is_published',
        'created_at', 'updated_at'
    ]
    search_fields = ['title', 'client_name', 'summary', 'description']
    list_editable = ['is_featured', 'is_published', 'order']
    readonly_fields = ['slug', 'created_at', 'updated_at', 'reading_time']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'subtitle', 'summary', 'description', 'slug')
        }),
        ('Client Information', {
            'fields': ('client_name', 'client_industry', 'client_size')
        }),
        ('Project Details', {
            'fields': ('category', 'project_duration', 'team_size', 'budget_range')
        }),
        ('Challenge & Solution', {
            'fields': ('challenge', 'solution', 'approach')
        }),
        ('Technologies', {
            'fields': ('technologies', 'tools')
        }),
        ('Results & Impact', {
            'fields': ('business_objectives', 'key_results', 'metrics', 'roi')
        }),
        ('Client Feedback', {
            'fields': ('client_testimonial', 'client_contact_name', 'client_contact_role')
        }),
        ('Visual Content', {
            'fields': ('hero_image', 'gallery_images')
        }),
        ('External Links', {
            'fields': ('live_url', 'case_study_pdf')
        }),
        ('Status & Visibility', {
            'fields': ('is_featured', 'is_published', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()
    
    def save_model(self, request, obj, form, change):
        if not change and obj.is_published:  # New case study being published
            from django.utils import timezone
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)
