"""
Admin configuration for contact app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    """Admin configuration for ContactSubmission model."""
    
    list_display = [
        'name', 'company', 'service_interest', 'budget_range', 'lead_status', 
        'priority', 'assigned_to', 'created_at', 'is_read'
    ]
    list_filter = [
        'lead_status', 'priority', 'subject', 'is_read', 'created_at',
        'assigned_to'
    ]
    search_fields = [
        'name', 'email', 'company', 'project_description', 'message'
    ]
    list_editable = ['lead_status', 'priority', 'is_read', 'assigned_to']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'company', 'position')
        }),
        ('Project Details', {
            'fields': (
                'subject', 'service_interest', 'project_description',
                'budget_range', 'timeline', 'project_size'
            ),
            'description': 'Project requirements and business details'
        }),
        ('Lead Management', {
            'fields': (
                'lead_status', 'priority', 'assigned_to', 'estimated_value'
            ),
            'description': 'Sales pipeline and lead qualification'
        }),
        ('Communication', {
            'fields': (
                'message', 'is_read', 'last_contact_date', 'next_follow_up'
            ),
            'description': 'Communication tracking and follow-up scheduling'
        }),
        ('Internal Notes', {
            'fields': ('notes',),
            'description': 'Internal notes for sales team'
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_contacted', 'mark_as_qualified', 'schedule_follow_up']
    
    def mark_as_contacted(self, request, queryset):
        """Mark selected leads as contacted."""
        updated = queryset.update(lead_status='contacted', is_read=True)
        self.message_user(request, f'{updated} leads marked as contacted.')
    mark_as_contacted.short_description = "Mark as contacted"
    
    def mark_as_qualified(self, request, queryset):
        """Mark selected leads as qualified."""
        updated = queryset.update(lead_status='qualified')
        self.message_user(request, f'{updated} leads marked as qualified.')
    mark_as_qualified.short_description = "Mark as qualified"
    
    def schedule_follow_up(self, request, queryset):
        """Schedule follow-up for selected leads."""
        from django.utils import timezone
        from datetime import timedelta
        
        # Schedule follow-up in 7 days
        follow_up_date = timezone.now() + timedelta(days=7)
        updated = queryset.update(
            next_follow_up=follow_up_date,
            lead_status='contacted'
        )
        self.message_user(request, f'Follow-up scheduled for {updated} leads in 7 days.')
    schedule_follow_up.short_description = "Schedule follow-up in 7 days"
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related('assigned_to')
    
    def get_list_display(self, request):
        """Customize list display based on user permissions."""
        if request.user.is_superuser:
            return self.list_display
        # Remove sensitive fields for non-superusers
        return [field for field in self.list_display if field not in ['estimated_value', 'notes']]
