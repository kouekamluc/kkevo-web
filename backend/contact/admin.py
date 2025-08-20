"""
Admin configuration for contact app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    """Admin configuration for ContactSubmission model."""

    list_display = [
        'name', 'email', 'company', 'subject', 'lead_score', 'status', 
        'assigned_to', 'submitted_at', 'is_high_priority_display', 'needs_follow_up_display'
    ]
    
    list_filter = [
        'subject', 'status', 'lead_score', 'industry', 'urgency',
        'project_budget', 'timeline', 'team_size', 'submitted_at',
        'assigned_to'
    ]
    
    search_fields = ['name', 'email', 'company', 'message', 'notes']
    
    list_editable = ['status', 'lead_score', 'assigned_to']
    
    readonly_fields = [
        'id', 'submitted_at', 'first_contacted_at', 'last_contacted_at',
        'follow_up_scheduled', 'follow_up_completed', 'created_at', 'updated_at',
        'is_high_priority_display', 'is_qualified_display', 'needs_follow_up_display',
        'time_since_submission_display'
    ]

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'email', 'phone', 'company', 'subject', 'message')
        }),
        ('Project Details', {
            'fields': ('project_budget', 'timeline', 'team_size', 'industry', 'urgency'),
            'classes': ('collapse',)
        }),
        ('Lead Management', {
            'fields': ('lead_score', 'status', 'assigned_to', 'notes')
        }),
        ('Tracking & Analytics', {
            'fields': ('source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'),
            'classes': ('collapse',)
        }),
        ('Communication History', {
            'fields': ('first_contacted_at', 'last_contacted_at', 'follow_up_scheduled', 'follow_up_completed'),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('id', 'submitted_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = [
        'mark_as_contacted', 'mark_as_qualified', 'schedule_follow_up', 
        'assign_to_team_member', 'export_contacts', 'recalculate_lead_scores'
    ]

    def is_high_priority_display(self, obj):
        """Display high priority status with color coding."""
        if obj.is_high_priority:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ High Priority</span>'
            )
        return format_html(
            '<span style="color: gray;">Standard</span>'
        )
    is_high_priority_display.short_description = 'Priority'

    def is_qualified_display(self, obj):
        """Display qualified status with color coding."""
        if obj.is_qualified:
            return format_html(
                '<span style="color: blue; font-weight: bold;">✓ Qualified</span>'
            )
        return format_html(
            '<span style="color: orange;">Developing</span>'
        )
    is_qualified_display.short_description = 'Qualified'

    def needs_follow_up_display(self, obj):
        """Display follow-up status with color coding."""
        if obj.needs_follow_up:
            return format_html(
                '<span style="color: red; font-weight: bold;">⚠ Needs Follow-up</span>'
            )
        elif obj.follow_up_scheduled:
            return format_html(
                '<span style="color: orange;">📅 Scheduled: {}</span>',
                obj.follow_up_scheduled.strftime('%Y-%m-%d')
            )
        return format_html(
            '<span style="color: green;">✓ No Action Needed</span>'
        )
    needs_follow_up_display.short_description = 'Follow-up Status'

    def time_since_submission_display(self, obj):
        """Display time since submission."""
        delta = obj.time_since_submission
        days = delta.days
        if days == 0:
            hours = delta.seconds // 3600
            if hours == 0:
                minutes = delta.seconds // 60
                return f"{minutes} minutes ago"
            return f"{hours} hours ago"
        elif days == 1:
            return "1 day ago"
        else:
            return f"{days} days ago"
    time_since_submission_display.short_description = 'Time Since Submission'

    def mark_as_contacted(self, request, queryset):
        """Mark selected leads as contacted."""
        updated = queryset.update(status='contacted')
        self.message_user(
            request, 
            f'Successfully marked {updated} leads as contacted.'
        )
    mark_as_contacted.short_description = 'Mark as contacted'

    def mark_as_qualified(self, request, queryset):
        """Mark selected leads as qualified."""
        updated = queryset.update(status='qualified')
        self.message_user(
            request, 
            f'Successfully marked {updated} leads as qualified.'
        )
    mark_as_qualified.short_description = 'Mark as qualified'

    def schedule_follow_up(self, request, queryset):
        """Schedule follow-up for selected leads."""
        # This would typically open a form to select the date
        # For now, we'll just update the status
        updated = queryset.update(status='reviewed')
        self.message_user(
            request, 
            f'Successfully marked {updated} leads for follow-up review.'
        )
    schedule_follow_up.short_description = 'Schedule follow-up'

    def assign_to_team_member(self, request, queryset):
        """Assign selected leads to a team member."""
        # This would typically open a form to select the team member
        # For now, we'll just update the status
        updated = queryset.update(status='reviewed')
        self.message_user(
            request, 
            f'Successfully marked {updated} leads for team assignment.'
        )
    assign_to_team_member.short_description = 'Assign to team member'

    def export_contacts(self, request, queryset):
        """Export selected contacts to CSV."""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="contacts.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Name', 'Email', 'Company', 'Subject', 'Lead Score', 'Status',
            'Project Budget', 'Timeline', 'Team Size', 'Industry', 'Urgency',
            'Submitted At', 'Message'
        ])
        
        for contact in queryset:
            writer.writerow([
                contact.name, contact.email, contact.company, contact.subject,
                contact.lead_score, contact.status, contact.project_budget,
                contact.timeline, contact.team_size, contact.industry,
                contact.urgency, contact.submitted_at, contact.message
            ])
        
        return response
    export_contacts.short_description = 'Export to CSV'

    def recalculate_lead_scores(self, request, queryset):
        """Recalculate lead scores for selected contacts."""
        updated = 0
        for contact in queryset:
            old_score = contact.lead_score
            contact.lead_score = contact.calculate_lead_score()
            if contact.lead_score != old_score:
                contact.save(update_fields=['lead_score'])
                updated += 1
        
        self.message_user(
            request, 
            f'Successfully recalculated lead scores for {updated} contacts.'
        )
    recalculate_lead_scores.short_description = 'Recalculate lead scores'

    def get_queryset(self, request):
        """Custom queryset with optimized database queries."""
        return super().get_queryset(request).select_related('assigned_to')

    def get_list_display(self, request):
        """Customize list display based on user permissions."""
        list_display = list(super().get_list_display(request))
        
        # Add lead score color coding for better visibility
        if 'lead_score' in list_display:
            list_display[list_display.index('lead_score')] = 'colored_lead_score'
        
        return list_display

    def colored_lead_score(self, obj):
        """Display lead score with color coding."""
        if obj.lead_score >= 75:
            color = 'green'
            label = 'High'
        elif obj.lead_score >= 50:
            color = 'blue'
            label = 'Medium'
        else:
            color = 'orange'
            label = 'Low'
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} ({})</span>',
            color, obj.lead_score, label
        )
    colored_lead_score.short_description = 'Lead Score'
