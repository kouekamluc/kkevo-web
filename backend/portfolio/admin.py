from django.contrib import admin
from .models import Portfolio


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'client', 'year', 'is_featured', 
        'status', 'order', 'created_at'
    ]
    list_filter = ['category', 'status', 'is_featured', 'year']
    search_fields = ['title', 'description', 'client']
    list_editable = ['order', 'is_featured', 'status']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'reading_time']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'long_description')
        }),
        ('Project Details', {
            'fields': ('category', 'client', 'year', 'duration', 'team_size')
        }),
        ('Content', {
            'fields': ('hero_image', 'gallery_images', 'technologies')
        }),
        ('Results & Metrics', {
            'fields': ('results',)
        }),
        ('External Links', {
            'fields': ('live_url', 'github_url', 'case_study_url')
        }),
        ('Settings', {
            'fields': ('is_featured', 'order', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'reading_time'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()
