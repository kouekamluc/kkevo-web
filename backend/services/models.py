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
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
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
