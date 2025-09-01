"""
Service models for KKEVO.
"""
import uuid
from django.db import models
from django.utils.text import slugify


class Service(models.Model):
    """Service model for KKEVO services."""
    
    CATEGORY_CHOICES = [
        ('web-development', 'Web Development'),
        ('mobile-development', 'Mobile Development'),
        ('cloud-solutions', 'Cloud Solutions'),
        ('ai-ml', 'AI & Machine Learning'),
        ('devops', 'DevOps & Infrastructure'),
        ('consulting', 'Consulting'),
        ('design', 'UI/UX Design'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_desc = models.TextField()
    long_desc = models.TextField()
    icon = models.CharField(max_length=255, blank=True, null=True, help_text="Icon filename or path")
    image = models.ImageField(upload_to='services/', blank=True, null=True, help_text="Service image")
    image_alt = models.CharField(max_length=255, blank=True, null=True, help_text="Alt text for service image")
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
    def image_url(self):
        """Return the full URL for the service image."""
        if self.image:
            return self.image.url
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


class CompanyConfig(models.Model):
    """Company configuration for managing frontend content"""
    
    # Hero Section Configuration
    hero_headline = models.CharField(
        max_length=200,
        default="We Build Software That Moves Markets",
        help_text="Main headline for the hero section"
    )
    hero_subtitle = models.TextField(
        default="Transform your business with cutting-edge software solutions. From web applications to AI-powered systems, we deliver results that drive growth.",
        help_text="Subtitle text below the main headline"
    )
    hero_features = models.JSONField(
        default=list,
        help_text="Hero features as JSON array. Example: ['Custom Software Development', 'Web & Mobile Applications']"
    )
    
    # CTA Section Configuration
    cta_headline = models.CharField(
        max_length=200,
        default="Ready to Transform Your Business?",
        help_text="Main CTA headline"
    )
    cta_subtitle = models.TextField(
        default="Let's discuss how our innovative software solutions can drive growth, streamline operations, and create competitive advantages for your business.",
        help_text="CTA subtitle text"
    )
    cta_benefits = models.JSONField(
        default=list,
        help_text="CTA benefits as JSON array"
    )
    
    # Contact Information
    company_phone = models.CharField(
        max_length=20,
        default="+1 (555) 123-4567",
        help_text="Company phone number"
    )
    company_email = models.EmailField(
        default="hello@kkevo.com",
        help_text="Company email address"
    )
    company_address = models.TextField(
        blank=True,
        help_text="Company office address"
    )
    live_chat_enabled = models.BooleanField(
        default=True,
        help_text="Enable live chat functionality"
    )
    
    # Trust Indicators
    trust_companies = models.JSONField(
        default=list,
        help_text="Trusted companies logos as JSON array. Example: ['TechCorp', 'FinanceBank']"
    )
    
    # Social Media
    linkedin_url = models.URLField(blank=True, help_text="Company LinkedIn URL")
    twitter_url = models.URLField(blank=True, help_text="Company Twitter URL")
    github_url = models.URLField(blank=True, help_text="Company GitHub URL")
    
    # Meta
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Company Configuration'
        verbose_name_plural = 'Company Configuration'
    
    def __str__(self):
        return "Company Configuration"
    
    @classmethod
    def get_active_config(cls):
        """Get the active company configuration."""
        return cls.objects.filter(is_active=True).first()
    
    def get_hero_features_display(self):
        """Return hero features as a list, with fallback to defaults."""
        if self.hero_features:
            return self.hero_features
        return [
            'Custom Software Development',
            'Web & Mobile Applications',
            'Cloud Infrastructure',
            'AI & Machine Learning',
        ]
    
    def get_cta_benefits_display(self):
        """Return CTA benefits as a list, with fallback to defaults."""
        if self.cta_benefits:
            return self.cta_benefits
        return [
            'Free initial consultation and project assessment',
            'Transparent pricing with no hidden fees',
            'Dedicated project manager and development team',
            'Regular progress updates and milestone reviews',
            'Post-launch support and maintenance',
            'Scalable solutions that grow with your business',
        ]
    
    def get_trust_companies_display(self):
        """Return trust companies as a list, with fallback to defaults."""
        if self.trust_companies:
            return self.trust_companies
        return ['TechCorp', 'FinanceBank', 'DataFlow', 'InsightMetrics']
