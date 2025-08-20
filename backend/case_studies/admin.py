from django.contrib import admin
from .models import CaseStudy


@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
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
