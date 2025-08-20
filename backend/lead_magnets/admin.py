"""
Admin configuration for lead magnets app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import LeadMagnetSubmission


@admin.register(LeadMagnetSubmission)
class LeadMagnetSubmissionAdmin(admin.ModelAdmin):
    """Admin configuration for LeadMagnetSubmission model."""
    
    list_display = [
        'name', 'email', 'lead_magnet_type', 'status', 'lead_score', 
        'form_submitted_at', 'pdf_downloaded', 'source_display'
    ]
    list_filter = [
        'lead_magnet_type', 'status', 'source', 'is_subscribed_to_newsletter',
        'form_submitted_at', 'pdf_downloaded_at'
    ]
    search_fields = ['name', 'email', 'company', 'notes']
    list_editable = ['status', 'lead_score']
    readonly_fields = [
        'id', 'form_submitted_at', 'pdf_downloaded_at', 'email_sent_at', 
        'email_opened_at', 'created_at', 'updated_at', 'time_to_download_display',
        'is_qualified_lead_display', 'needs_follow_up_display'
    ]
    
    fieldsets = (
        ('Lead Information', {
            'fields': ('name', 'email', 'company', 'role')
        }),
        ('Lead Magnet Details', {
            'fields': ('lead_magnet_type', 'source')
        }),
        ('Conversion Tracking', {
            'fields': ('form_submitted_at', 'pdf_downloaded_at', 'email_sent_at', 'email_opened_at'),
            'classes': ('collapse',)
        }),
        ('Marketing & Analytics', {
            'fields': (
                'is_subscribed_to_newsletter', 'follow_up_scheduled', 'follow_up_completed',
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'
            ),
            'classes': ('collapse',)
        }),
        ('Lead Management', {
            'fields': ('status', 'lead_score', 'notes')
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_qualified', 'schedule_follow_up', 'export_leads']
    
    def pdf_downloaded(self, obj):
        """Display PDF download status."""
        if obj.pdf_downloaded_at:
            return format_html(
                '<span style="color: green;">✓ Downloaded</span><br><small>{}</small>',
                obj.pdf_downloaded_at.strftime('%Y-%m-%d %H:%M')
            )
        return format_html('<span style="color: red;">✗ Not Downloaded</span>')
    
    pdf_downloaded.short_description = 'PDF Status'
    
    def source_display(self, obj):
        """Display source with icon."""
        source_icons = {
            'website': '🌐',
            'social-media': '📱',
            'email': '📧',
            'referral': '👥',
            'search': '🔍',
            'other': '❓'
        }
        icon = source_icons.get(obj.source, '❓')
        return f"{icon} {obj.get_source_display()}"
    
    source_display.short_description = 'Source'
    
    def time_to_download_display(self, obj):
        """Display time to download."""
        time_to_download = obj.time_to_download
        if time_to_download:
            minutes = time_to_download.total_seconds() / 60
            if minutes < 1:
                return f"{int(time_to_download.total_seconds())} seconds"
            elif minutes < 60:
                return f"{int(minutes)} minutes"
            else:
                hours = minutes / 60
                return f"{hours:.1f} hours"
        return "N/A"
    
    time_to_download_display.short_description = 'Time to Download'
    
    def is_qualified_lead_display(self, obj):
        """Display qualified lead status."""
        if obj.is_qualified_lead:
            return format_html('<span style="color: green;">✓ Qualified</span>')
        return format_html('<span style="color: red;">✗ Not Qualified</span>')
    
    is_qualified_lead_display.short_description = 'Qualified Lead'
    
    def needs_follow_up_display(self, obj):
        """Display follow-up status."""
        if obj.needs_follow_up:
            return format_html('<span style="color: orange;">⚠ Needs Follow-up</span>')
        return format_html('<span style="color: green;">✓ Follow-up Scheduled</span>')
    
    needs_follow_up_display.short_description = 'Follow-up Status'
    
    def mark_as_qualified(self, request, queryset):
        """Mark selected leads as qualified."""
        updated = queryset.update(status='qualified', lead_score=75)
        self.message_user(request, f'{updated} leads marked as qualified.')
    
    mark_as_qualified.short_description = 'Mark as qualified'
    
    def schedule_follow_up(self, request, queryset):
        """Schedule follow-up for selected leads."""
        from django.utils import timezone
        from datetime import timedelta
        
        tomorrow = timezone.now() + timedelta(days=1)
        updated = queryset.update(follow_up_scheduled=tomorrow)
        self.message_user(request, f'Follow-up scheduled for {updated} leads.')
    
    schedule_follow_up.short_description = 'Schedule follow-up'
    
    def export_leads(self, request, queryset):
        """Export leads to CSV."""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="leads_export.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Name', 'Email', 'Company', 'Role', 'Lead Magnet', 'Status', 
            'Lead Score', 'Form Submitted', 'PDF Downloaded', 'Source'
        ])
        
        for lead in queryset:
            writer.writerow([
                lead.name, lead.email, lead.company, lead.role,
                lead.get_lead_magnet_type_display(), lead.get_status_display(),
                lead.lead_score, lead.form_submitted_at.strftime('%Y-%m-%d %H:%M'),
                lead.pdf_downloaded_at.strftime('%Y-%m-%d %H:%M') if lead.pdf_downloaded_at else '',
                lead.get_source_display()
            ])
        
        return response
    
    export_leads.short_description = 'Export to CSV'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related()
