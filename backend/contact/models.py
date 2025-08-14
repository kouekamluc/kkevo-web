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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    is_read = models.BooleanField(default=False)
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
