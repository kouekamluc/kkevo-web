"""
Team models for KKEVO.
"""
import uuid
from django.db import models


class TeamMember(models.Model):
    """Team member model for KKEVO."""
    
    ROLE_CHOICES = [
        ('ceo', 'CEO'),
        ('cto', 'CTO'),
        ('developer', 'Developer'),
        ('designer', 'Designer'),
        ('devops', 'DevOps Engineer'),
        ('pm', 'Project Manager'),
        ('qa', 'QA Engineer'),
        ('intern', 'Intern'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField()
    avatar = models.ImageField(upload_to='team/avatars/', blank=True, null=True)
    social_links = models.JSONField(
        default=dict,
        help_text='Social media links as JSON. Example: {"linkedin": "url", "github": "url"}'
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'
    
    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"
    
    @property
    def avatar_url(self):
        """Return the avatar URL."""
        if self.avatar:
            return self.avatar.url
        return None
    
    @property
    def linkedin_url(self):
        """Return LinkedIn URL if available."""
        return self.social_links.get('linkedin', '')
    
    @property
    def github_url(self):
        """Return GitHub URL if available."""
        return self.social_links.get('github', '')
    
    @property
    def twitter_url(self):
        """Return Twitter URL if available."""
        return self.social_links.get('twitter', '')
