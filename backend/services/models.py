"""
Service models for KKEVO.
"""
import uuid
from django.db import models
from django.utils.text import slugify


class Service(models.Model):
    """Service model for KKEVO services."""
    
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile Development'),
        ('devops', 'DevOps & Cloud'),
        ('ai', 'AI & Machine Learning'),
        ('consulting', 'Consulting'),
        ('design', 'UI/UX Design'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_desc = models.TextField()
    long_desc = models.TextField()
    icon = models.CharField(max_length=255, blank=True, null=True, help_text="Icon filename or path")
    features = models.JSONField(default=list)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Business Logic Fields
    pricing_tiers = models.JSONField(
        default=dict,
        help_text="Pricing tiers as JSON. Example: {'Basic': '$5k', 'Pro': '$15k', 'Enterprise': '$50k'}"
    )
    timeline_estimates = models.JSONField(
        default=dict,
        help_text="Timeline estimates as JSON. Example: {'Basic': '2-4 weeks', 'Pro': '6-8 weeks'}"
    )
    budget_ranges = models.JSONField(
        default=dict,
        help_text="Budget ranges as JSON. Example: {'Basic': '$3k-$8k', 'Pro': '$10k-$25k'}"
    )
    min_budget = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Minimum project budget in USD"
    )
    max_budget = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Maximum project budget in USD"
    )
    
    # Service Details
    complexity_levels = models.JSONField(
        default=list,
        help_text="Complexity levels as JSON array. Example: ['Simple', 'Medium', 'Complex']"
    )
    deliverables = models.JSONField(
        default=list,
        help_text="What client receives as JSON array. Example: ['Source Code', 'Documentation', 'Training']"
    )
    
    # Business Metrics
    average_project_duration = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Average project duration (e.g., '4-6 weeks')"
    )
    success_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Project success rate percentage (e.g., 95.5)"
    )
    
    # Display & Organization
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in featured services section")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return f'/services/{self.slug}/'
    
    @property
    def icon_url(self):
        """Return the full URL for the icon."""
        if self.icon:
            return f'/media/icons/{self.icon}'
        return None
    
    @property
    def display_budget_range(self):
        """Return formatted budget range for display."""
        if self.min_budget and self.max_budget:
            return f"${self.min_budget:,.0f} - ${self.max_budget:,.0f}"
        elif self.budget_ranges:
            # Return first budget range from JSON
            first_range = list(self.budget_ranges.values())[0] if self.budget_ranges else "Contact Us"
            return first_range
        return "Contact Us"
    
    @property
    def display_timeline(self):
        """Return formatted timeline for display."""
        if self.average_project_duration:
            return self.average_project_duration
        elif self.timeline_estimates:
            # Return first timeline from JSON
            first_timeline = list(self.timeline_estimates.values())[0] if self.timeline_estimates else "Contact Us"
            return first_timeline
        return "Contact Us"


class CompanyStats(models.Model):
    """Company statistics for the stats section"""
    name = models.CharField(max_length=100, unique=True)
    value = models.IntegerField()
    suffix = models.CharField(max_length=10, blank=True, help_text="e.g., +, %, /7")
    label = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, blank=True, help_text="Icon identifier")
    color_scheme = models.CharField(max_length=50, default="from-blue-500 to-cyan-500")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Company Statistic'
        verbose_name_plural = 'Company Statistics'

    def __str__(self):
        return f"{self.name}: {self.value}{self.suffix}"

    def get_display_value(self):
        return f"{self.value}{self.suffix}"
