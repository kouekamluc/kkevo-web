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
        ('devops', 'DevOps'),
        ('ai', 'AI & Machine Learning'),
        ('consulting', 'Consulting'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_desc = models.TextField(max_length=500)
    long_desc = models.TextField()
    icon = models.FileField(upload_to='services/icons/', help_text='SVG icon file')
    features = models.JSONField(default=list, help_text='List of service features')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='web')
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
    
    @property
    def icon_url(self):
        """Return the icon URL."""
        if self.icon:
            return self.icon.url
        return None
