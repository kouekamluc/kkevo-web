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
    
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('unavailable', 'Unavailable'),
        ('on_leave', 'On Leave'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField()
    
    # Professional Details
    experience_years = models.PositiveIntegerField(
        default=0,
        help_text="Years of professional experience"
    )
    skills = models.JSONField(
        default=list,
        help_text="Technical skills as JSON array. Example: ['React', 'Python', 'AWS']"
    )
    skill_levels = models.JSONField(
        default=dict,
        help_text="Skill proficiency levels as JSON. Example: {'React': 'Expert', 'Python': 'Advanced'}"
    )
    certifications = models.JSONField(
        default=list,
        help_text="Professional certifications as JSON array"
    )
    
    # Work & Availability
    availability = models.CharField(
        max_length=20, 
        choices=AVAILABILITY_CHOICES, 
        default='available'
    )
    current_workload = models.PositiveIntegerField(
        default=0,
        help_text="Current workload percentage (0-100)"
    )
    max_workload = models.PositiveIntegerField(
        default=100,
        help_text="Maximum workload capacity (0-100)"
    )
    hourly_rate = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Hourly rate in USD"
    )
    
    # Contact & Social
    avatar = models.ImageField(upload_to='team/avatars/', blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    social_links = models.JSONField(
        default=dict,
        help_text='Social media links as JSON. Example: {"linkedin": "url", "github": "url"}'
    )
    
    # Project Assignment
    current_projects = models.JSONField(
        default=list,
        help_text="Current project assignments as JSON array"
    )
    specializations = models.JSONField(
        default=list,
        help_text="Areas of specialization as JSON array"
    )
    
    # Display & Organization
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
    
    @property
    def is_available_for_projects(self):
        """Check if team member is available for new projects."""
        return (
            self.availability == 'available' and
            self.current_workload < self.max_workload and
            self.is_active
        )
    
    @property
    def workload_percentage(self):
        """Calculate workload percentage."""
        if self.max_workload > 0:
            return (self.current_workload / self.max_workload) * 100
        return 0
    
    @property
    def top_skills(self):
        """Return top 3 skills for display."""
        if self.skills:
            return self.skills[:3]
        return []
    
    @property
    def experience_level(self):
        """Return experience level based on years."""
        if self.experience_years >= 10:
            return 'Senior'
        elif self.experience_years >= 5:
            return 'Mid-level'
        elif self.experience_years >= 2:
            return 'Junior'
        else:
            return 'Entry-level'
