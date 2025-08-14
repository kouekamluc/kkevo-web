"""
Blog models for KKEVO.
"""
import uuid
from django.db import models
from django.utils.text import slugify
from team.models import TeamMember


class BlogPost(models.Model):
    """Blog post model for KKEVO."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    summary = models.TextField(max_length=500)
    body = models.TextField()
    hero_image = models.ImageField(upload_to='blog/hero_images/')
    author = models.ForeignKey(
        TeamMember, 
        on_delete=models.CASCADE, 
        related_name='blog_posts'
    )
    tags = models.JSONField(default=list, help_text='List of tags as JSON array')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def hero_image_url(self):
        """Return the hero image URL."""
        if self.hero_image:
            return self.hero_image.url
        return None
    
    @property
    def author_name(self):
        """Return the author's name."""
        return self.author.name if self.author else 'Unknown'
    
    @property
    def author_role(self):
        """Return the author's role."""
        return self.author.get_role_display() if self.author else ''
    
    @property
    def author_avatar(self):
        """Return the author's avatar URL."""
        if self.author and self.author.avatar:
            return self.author.avatar.url
        return None
    
    @property
    def reading_time(self):
        """Estimate reading time in minutes."""
        words_per_minute = 200
        word_count = len(self.body.split())
        minutes = word_count / words_per_minute
        return max(1, round(minutes))
