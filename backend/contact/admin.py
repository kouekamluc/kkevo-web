"""
Admin configuration for contact app.
"""
from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    """Admin configuration for ContactSubmission model."""
    
    list_display = [
        'name', 'email', 'subject', 'company', 'is_read', 'created_at'
    ]
    list_filter = ['subject', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'message', 'company']
    list_editable = ['is_read']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'company')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request)
    
    def mark_as_read(self, request, queryset):
        """Mark selected submissions as read."""
        queryset.update(is_read=True)
        self.message_user(request, f"{queryset.count()} submissions marked as read.")
    
    mark_as_read.short_description = "Mark selected submissions as read"
    
    actions = ['mark_as_read']
