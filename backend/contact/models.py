"""
Contact models for KKEVO.
"""
import uuid
from django.db import models
from django.utils import timezone


class ContactSubmission(models.Model):
    """Enhanced contact form submission model with lead scoring capabilities."""

    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('project', 'Project Request'),
        ('partnership', 'Partnership'),
        ('career', 'Career Opportunity'),
        ('support', 'Technical Support'),
        ('consultation', 'Free Consultation'),
        ('quote', 'Get a Quote'),
        ('other', 'Other'),
    ]

    PROJECT_BUDGET_CHOICES = [
        ('under-10k', 'Under $10,000'),
        ('10k-25k', '$10,000 - $25,000'),
        ('25k-50k', '$25,000 - $50,000'),
        ('50k-100k', '$50,000 - $100,000'),
        ('100k-250k', '$100,000 - $250,000'),
        ('250k+', '$250,000+'),
        ('not-sure', 'Not sure yet'),
    ]

    TIMELINE_CHOICES = [
        ('asap', 'ASAP (Within 1 month)'),
        ('1-3-months', '1-3 months'),
        ('3-6-months', '3-6 months'),
        ('6-12-months', '6-12 months'),
        ('12-months+', '12+ months'),
        ('flexible', 'Flexible timeline'),
    ]

    TEAM_SIZE_CHOICES = [
        ('solo', 'Solo founder/developer'),
        ('2-5', '2-5 people'),
        ('6-10', '6-10 people'),
        ('11-25', '11-25 people'),
        ('26-50', '26-50 people'),
        ('50+', '50+ people'),
    ]

    INDUSTRY_CHOICES = [
        ('fintech', 'Financial Technology'),
        ('healthcare', 'Healthcare'),
        ('ecommerce', 'E-commerce'),
        ('saas', 'SaaS/Software'),
        ('education', 'Education'),
        ('real-estate', 'Real Estate'),
        ('manufacturing', 'Manufacturing'),
        ('consulting', 'Consulting'),
        ('other', 'Other'),
    ]

    URGENCY_CHOICES = [
        ('low', 'Low - Just exploring options'),
        ('medium', 'Medium - Planning phase'),
        ('high', 'High - Ready to start soon'),
        ('critical', 'Critical - Need immediate help'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('reviewed', 'Reviewed'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiating', 'Negotiating'),
        ('won', 'Won'),
        ('lost', 'Lost'),
        ('spam', 'Spam'),
    ]

    # Basic Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
    message = models.TextField()

    # Project Details (Optional)
    project_budget = models.CharField(max_length=20, choices=PROJECT_BUDGET_CHOICES, blank=True)
    timeline = models.CharField(max_length=20, choices=TIMELINE_CHOICES, blank=True)
    team_size = models.CharField(max_length=20, choices=TEAM_SIZE_CHOICES, blank=True)
    industry = models.CharField(max_length=20, choices=INDUSTRY_CHOICES, blank=True)
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, blank=True)

    # Lead Management
    lead_score = models.PositiveIntegerField(default=0, help_text="Lead scoring from 0-100")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    assigned_to = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_contacts'
    )
    notes = models.TextField(blank=True, help_text="Internal notes and follow-up information")

    # Tracking
    source = models.CharField(max_length=50, default='website', help_text="Where the contact came from")
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    utm_term = models.CharField(max_length=100, blank=True)
    utm_content = models.CharField(max_length=100, blank=True)

    # Timestamps
    submitted_at = models.DateTimeField(default=timezone.now)
    first_contacted_at = models.DateTimeField(null=True, blank=True)
    last_contacted_at = models.DateTimeField(null=True, blank=True)
    follow_up_scheduled = models.DateTimeField(null=True, blank=True)
    follow_up_completed = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
        indexes = [
            models.Index(fields=['email', 'status']),
            models.Index(fields=['status', 'submitted_at']),
            models.Index(fields=['lead_score', 'submitted_at']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['utm_source', 'utm_campaign']),
        ]

    def __str__(self):
        return f"{self.name} - {self.subject} - {self.submitted_at.strftime('%Y-%m-%d')}"

    @property
    def is_high_priority(self):
        """Check if this is a high priority lead."""
        return self.lead_score >= 75

    @property
    def is_qualified(self):
        """Check if this is a qualified lead."""
        return self.lead_score >= 50

    @property
    def needs_follow_up(self):
        """Check if this lead needs follow-up."""
        if self.follow_up_scheduled:
            return timezone.now() >= self.follow_up_scheduled
        return False

    @property
    def time_since_submission(self):
        """Calculate time since submission."""
        return timezone.now() - self.submitted_at

    def calculate_lead_score(self):
        """Calculate lead score based on form data."""
        score = 0
        
        # Basic information (0-20 points)
        if self.name: score += 5
        if self.email: score += 5
        if self.phone: score += 5
        if self.company: score += 5
        
        # Project details (0-40 points)
        if self.project_budget:
            budget_score = {
                'under-10k': 5,
                '10k-25k': 10,
                '25k-50k': 15,
                '50k-100k': 20,
                '100k-250k': 25,
                '250k+': 30,
                'not-sure': 10
            }
            score += budget_score.get(self.project_budget, 0)
        
        if self.timeline:
            timeline_score = {
                'asap': 20,
                '1-3-months': 15,
                '3-6-months': 10,
                '6-12-months': 5,
                '12-months+': 0,
                'flexible': 10
            }
            score += timeline_score.get(self.timeline, 0)
        
        if self.team_size:
            team_score = {
                'solo': 10,
                '2-5': 15,
                '6-10': 20,
                '11-25': 25,
                '26-50': 30,
                '50+': 35
            }
            score += team_score.get(self.team_size, 0)
        
        if self.industry:
            industry_score = {
                'fintech': 20,
                'healthcare': 20,
                'ecommerce': 15,
                'saas': 25,
                'education': 15,
                'real-estate': 10,
                'manufacturing': 15,
                'consulting': 10,
                'other': 10
            }
            score += industry_score.get(self.industry, 0)
        
        if self.urgency:
            urgency_score = {
                'low': 5,
                'medium': 10,
                'high': 20,
                'critical': 25
            }
            score += urgency_score.get(self.urgency, 0)
        
        # Subject priority (0-20 points)
        if self.subject:
            subject_score = {
                'project': 20,
                'consultation': 15,
                'quote': 15,
                'partnership': 10,
                'general': 5,
                'support': 10,
                'career': 5,
                'other': 5
            }
            score += subject_score.get(self.subject, 0)
        
        return min(score, 100)  # Cap at 100

    def save(self, *args, **kwargs):
        """Override save to automatically calculate lead score."""
        if not self.lead_score:
            self.lead_score = self.calculate_lead_score()
        super().save(*args, **kwargs)

    def mark_as_contacted(self):
        """Mark the lead as contacted."""
        now = timezone.now()
        if not self.first_contacted_at:
            self.first_contacted_at = now
        self.last_contacted_at = now
        self.status = 'contacted'
        self.save(update_fields=['first_contacted_at', 'last_contacted_at', 'status', 'updated_at'])

    def schedule_follow_up(self, follow_up_date):
        """Schedule a follow-up for the lead."""
        self.follow_up_scheduled = follow_up_date
        self.save(update_fields=['follow_up_scheduled', 'updated_at'])

    def complete_follow_up(self):
        """Mark follow-up as completed."""
        self.follow_up_completed = timezone.now()
        self.save(update_fields=['follow_up_completed', 'updated_at'])

    def update_status(self, new_status):
        """Update the lead status."""
        self.status = new_status
        self.save(update_fields=['status', 'updated_at'])
