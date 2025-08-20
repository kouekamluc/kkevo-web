from django.db import models
from django.utils.text import slugify
from django.urls import reverse


class CaseStudy(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile Development'),
        ('ai', 'AI & Machine Learning'),
        ('devops', 'DevOps & Cloud'),
        ('consulting', 'Consulting'),
        ('design', 'UI/UX Design'),
        ('ecommerce', 'E-commerce'),
        ('healthcare', 'Healthcare'),
        ('finance', 'Finance'),
        ('education', 'Education'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    summary = models.TextField()
    description = models.TextField()
    
    # Client Information
    client_name = models.CharField(max_length=100)
    client_industry = models.CharField(max_length=100)
    client_size = models.CharField(max_length=50, blank=True)  # e.g., "Enterprise", "SMB"
    
    # Project Details
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    project_duration = models.CharField(max_length=50)
    team_size = models.CharField(max_length=50)
    budget_range = models.CharField(max_length=50, blank=True)
    
    # Challenge & Solution
    challenge = models.TextField(help_text="What business problems did the client face?")
    solution = models.TextField(help_text="How did we solve these challenges?")
    approach = models.TextField(help_text="What was our methodology and approach?")
    
    # Technologies Used
    technologies = models.JSONField(default=list, help_text="List of technologies used")
    tools = models.JSONField(default=list, help_text="List of tools and frameworks used")
    
    # Results & Impact
    business_objectives = models.JSONField(default=list, help_text="Business objectives as JSON array")
    key_results = models.JSONField(default=list, help_text="Key results achieved as JSON array")
    metrics = models.JSONField(default=dict, help_text="Quantifiable metrics and KPIs")
    roi = models.CharField(max_length=100, blank=True, help_text="ROI or business impact summary")
    
    # Client Feedback
    client_testimonial = models.TextField(blank=True)
    client_contact_name = models.CharField(max_length=100, blank=True)
    client_contact_role = models.CharField(max_length=100, blank=True)
    
    # Visual Content
    hero_image = models.ImageField(upload_to='case_studies/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    
    # External Links
    live_url = models.URLField(blank=True)
    case_study_pdf = models.FileField(upload_to='case_studies/pdfs/', blank=True, null=True)
    
    # Status and Visibility
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['order', '-published_at', '-created_at']
        verbose_name = 'Case Study'
        verbose_name_plural = 'Case Studies'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('case_studies:detail', kwargs={'slug': self.slug})

    @property
    def reading_time(self):
        """Estimate reading time for case study"""
        word_count = len(self.description.split())
        return max(1, round(word_count / 200))  # 200 words per minute

    @property
    def has_metrics(self):
        """Check if case study has measurable results"""
        return bool(self.metrics and len(self.metrics) > 0)

    @property
    def has_testimonial(self):
        """Check if case study has client testimonial"""
        return bool(self.client_testimonial and self.client_contact_name)
