"""
Contact models for KKEVO.
"""
import uuid
from django.db import models


class ContactSubmission(models.Model):
    """Contact submission model for KKEVO."""
    
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('project', 'Project Request'),
        ('partnership', 'Partnership'),
        ('career', 'Career Opportunity'),
        ('support', 'Technical Support'),
        ('other', 'Other'),
    ]
    
    LEAD_STATUS_CHOICES = [
        ('new', 'New Lead'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiating', 'Negotiating'),
        ('converted', 'Converted to Project'),
        ('lost', 'Lost'),
        ('archived', 'Archived'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Contact Information
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True, help_text="Job title/position")
    
    # Project & Service Details
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    service_interest = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Which service are they interested in?"
    )
    project_description = models.TextField(
        blank=True,
        help_text="Detailed description of their project or needs"
    )
    
    # Business Requirements
    budget_range = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Budget range (e.g., '$10k - $25k', '$50k+')"
    )
    timeline = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Project timeline (e.g., '3-6 months', 'ASAP')"
    )
    project_size = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Project size (e.g., 'Small', 'Medium', 'Large', 'Enterprise')"
    )
    
    # Lead Management
    lead_status = models.CharField(
        max_length=20, 
        choices=LEAD_STATUS_CHOICES, 
        default='new'
    )
    priority = models.CharField(
        max_length=20, 
        choices=PRIORITY_CHOICES, 
        default='medium'
    )
    assigned_to = models.ForeignKey(
        'team.TeamMember', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Team member assigned to this lead"
    )
    
    # Communication Tracking
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    last_contact_date = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="Date of last contact attempt"
    )
    next_follow_up = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When to follow up next"
    )
    
    # Internal Notes
    notes = models.TextField(
        blank=True,
        help_text="Internal notes for sales team"
    )
    estimated_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Estimated project value in USD"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
    
    def __str__(self):
        return f"{self.name} - {self.subject} - {self.created_at.strftime('%Y-%m-%d')}"
    
    @property
    def short_message(self):
        """Return truncated message for admin display."""
        return self.message[:100] + "..." if len(self.message) > 100 else self.message
    
    @property
    def is_qualified_lead(self):
        """Check if this is a qualified lead based on criteria."""
        return (
            self.lead_status in ['qualified', 'proposal_sent', 'negotiating'] and
            self.budget_range and
            self.timeline and
            self.project_description
        )
    
    @property
    def days_since_contact(self):
        """Calculate days since last contact."""
        if self.last_contact_date:
            from django.utils import timezone
            delta = timezone.now() - self.last_contact_date
            return delta.days
        return None
    
    @property
    def needs_follow_up(self):
        """Check if lead needs follow-up."""
        if self.next_follow_up:
            from django.utils import timezone
            return timezone.now() >= self.next_follow_up
        return False
