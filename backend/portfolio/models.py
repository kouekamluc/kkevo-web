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
    
    # Images
    hero_image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    
    # Technologies used
    technologies = models.JSONField(default=list)
    
    # Project details
    duration = models.CharField(max_length=50, blank=True)
    team_size = models.CharField(max_length=50, blank=True)
    
    # Results and metrics
    results = models.JSONField(default=dict, blank=True)
    
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
