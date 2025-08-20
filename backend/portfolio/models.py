from django.db import models
from django.utils.text import slugify
from django.urls import reverse


class Portfolio(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile Development'),
        ('ai', 'AI & Machine Learning'),
        ('devops', 'DevOps & Cloud'),
        ('consulting', 'Consulting'),
        ('design', 'UI/UX Design'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    long_description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    client = models.CharField(max_length=100)
    year = models.CharField(max_length=4)
    
    # Business Context & Problem Solving
    challenge = models.TextField(
        blank=True,
        help_text="What business problems or challenges did the client face?"
    )
    solution = models.TextField(
        blank=True,
        help_text="How did we solve these challenges? What was our approach?"
    )
    
    # Business Impact & ROI
    business_objectives = models.JSONField(
        default=list,
        help_text="Business objectives as JSON array. Example: ['Increase Revenue', 'Improve Efficiency']"
    )
    roi_metrics = models.JSONField(
        default=dict,
        help_text="ROI metrics as JSON. Example: {'revenue': '+150%', 'users': '+200%', 'efficiency': '+300%'}"
    )
    key_results = models.JSONField(
        default=list,
        help_text="Key results achieved as JSON array. Example: ['50% cost reduction', '3x faster processing']"
    )
    
    # Project Details
    budget_range = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Project budget range (e.g., '$50k - $100k')"
    )
    project_timeline = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Project timeline (e.g., '3-6 months')"
    )
    team_size = models.CharField(max_length=50, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    
    # Client Feedback & Testimonials
    client_testimonial = models.TextField(
        blank=True,
        help_text="Direct client feedback about the project"
    )
    client_name = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Name of client contact for testimonial"
    )
    client_role = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Role of client contact (e.g., 'CTO', 'Product Manager')"
    )
    client_company = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Company name for testimonial attribution"
    )
    
    # Images
    hero_image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    
    # Technologies used
    technologies = models.JSONField(default=list)
    
    # External links
    live_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    case_study_url = models.URLField(blank=True)
    
    # Status and ordering
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('published', 'Published'),
            ('archived', 'Archived'),
        ],
        default='published'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Portfolio Project'
        verbose_name_plural = 'Portfolio Projects'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('portfolio:detail', kwargs={'slug': self.slug})

    @property
    def reading_time(self):
        """Estimate reading time for case study"""
        word_count = len(self.long_description.split())
        return max(1, round(word_count / 200))  # 200 words per minute
    
    @property
    def display_roi(self):
        """Return formatted ROI metrics for display"""
        if not self.roi_metrics:
            return "Contact us for details"
        
        # Format first few ROI metrics
        formatted_metrics = []
        for key, value in list(self.roi_metrics.items())[:3]:
            formatted_metrics.append(f"{key.title()}: {value}")
        
        return ", ".join(formatted_metrics)
    
    @property
    def has_business_impact(self):
        """Check if project has business impact data"""
        return bool(self.challenge and self.solution and self.roi_metrics)
    
    @property
    def has_testimonial(self):
        """Check if project has client testimonial"""
        return bool(self.client_testimonial and self.client_name)
