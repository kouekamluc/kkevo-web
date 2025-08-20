"""
Lead magnet models for KKEVO.
"""
import uuid
from django.db import models
from django.utils import timezone


class LeadMagnetSubmission(models.Model):
    """Lead magnet submission model for tracking downloads and conversions."""
    
    LEAD_MAGNET_CHOICES = [
        ('django-saas-checklist', 'Django SaaS Checklist'),
        ('startup-guide', 'Startup Guide'),
        ('tech-stack-guide', 'Tech Stack Guide'),
        ('funding-guide', 'Funding Guide'),
    ]
    
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('social-media', 'Social Media'),
        ('email', 'Email Campaign'),
        ('referral', 'Referral'),
        ('search', 'Search Engine'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Lead Information
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=100, blank=True)
    
    # Lead Magnet Details
    lead_magnet_type = models.CharField(
        max_length=50, 
        choices=LEAD_MAGNET_CHOICES,
        default='django-saas-checklist'
    )
    source = models.CharField(
        max_length=50, 
        choices=SOURCE_CHOICES,
        default='website'
    )
    
    # Conversion Tracking
    form_submitted_at = models.DateTimeField(auto_now_add=True)
    pdf_downloaded_at = models.DateTimeField(null=True, blank=True)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    email_opened_at = models.DateTimeField(null=True, blank=True)
    
    # Marketing & Follow-up
    is_subscribed_to_newsletter = models.BooleanField(default=True)
    follow_up_scheduled = models.DateTimeField(null=True, blank=True)
    follow_up_completed = models.DateTimeField(null=True, blank=True)
    
    # Analytics
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    utm_term = models.CharField(max_length=100, blank=True)
    utm_content = models.CharField(max_length=100, blank=True)
    
    # Internal Notes
    notes = models.TextField(blank=True)
    lead_score = models.PositiveIntegerField(default=0, help_text="Lead scoring from 0-100")
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ('new', 'New Lead'),
            ('downloaded', 'PDF Downloaded'),
            ('engaged', 'Engaged'),
            ('qualified', 'Qualified'),
            ('contacted', 'Contacted'),
            ('converted', 'Converted'),
            ('lost', 'Lost'),
        ],
        default='new'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Lead Magnet Submission'
        verbose_name_plural = 'Lead Magnet Submissions'
        indexes = [
            models.Index(fields=['email', 'lead_magnet_type']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['utm_source', 'utm_campaign']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.lead_magnet_type} - {self.created_at.strftime('%Y-%m-%d')}"
    
    @property
    def time_to_download(self):
        """Calculate time from form submission to PDF download."""
        if self.pdf_downloaded_at and self.form_submitted_at:
            return self.pdf_downloaded_at - self.form_submitted_at
        return None
    
    @property
    def is_qualified_lead(self):
        """Check if this is a qualified lead based on engagement."""
        return (
            self.status in ['engaged', 'qualified', 'contacted', 'converted'] and
            self.lead_score >= 50
        )
    
    @property
    def needs_follow_up(self):
        """Check if lead needs follow-up."""
        if self.follow_up_scheduled:
            return timezone.now() >= self.follow_up_scheduled
        return False
    
    def mark_pdf_downloaded(self):
        """Mark PDF as downloaded."""
        self.pdf_downloaded_at = timezone.now()
        self.status = 'downloaded'
        self.save(update_fields=['pdf_downloaded_at', 'status', 'updated_at'])
    
    def mark_email_opened(self):
        """Mark email as opened."""
        self.email_opened_at = timezone.now()
        self.status = 'engaged'
        self.save(update_fields=['email_opened_at', 'status', 'updated_at'])
    
    def update_lead_score(self, score):
        """Update lead score."""
        self.lead_score = max(0, min(100, score))
        if self.lead_score >= 75:
            self.status = 'qualified'
        elif self.lead_score >= 50:
            self.status = 'engaged'
        self.save(update_fields=['lead_score', 'status', 'updated_at'])
