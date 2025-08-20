"""
Blog models for KKEVO.
"""
import uuid
from django.db import models
from django.utils.text import slugify
from team.models import TeamMember
from django.utils import timezone


class BlogPost(models.Model):
    """Blog post model for KKEVO."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    CATEGORY_CHOICES = [
        ('technology', 'Technology'),
        ('business', 'Business'),
        ('design', 'Design'),
        ('development', 'Development'),
        ('ai-ml', 'AI & Machine Learning'),
        ('devops', 'DevOps'),
        ('case-studies', 'Case Studies'),
        ('industry-news', 'Industry News'),
        ('tutorials', 'Tutorials'),
        ('best-practices', 'Best Practices'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    summary = models.TextField(max_length=500)
    body = models.TextField()
    
    # Content Organization
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES, 
        default='technology'
    )
    tags = models.JSONField(
        default=list, 
        help_text='List of tags as JSON array'
    )
    related_services = models.JSONField(
        default=list,
        help_text='Related services as JSON array of service slugs'
    )
    
    # SEO Optimization
    seo_title = models.CharField(
        max_length=60, 
        blank=True,
        help_text='SEO meta title (max 60 characters)'
    )
    seo_description = models.TextField(
        max_length=160, 
        blank=True,
        help_text='SEO meta description (max 160 characters)'
    )
    seo_keywords = models.JSONField(
        default=list,
        help_text='SEO keywords as JSON array'
    )
    canonical_url = models.URLField(
        blank=True,
        help_text='Canonical URL for SEO'
    )
    
    # Content & Media
    hero_image = models.ImageField(upload_to='blog/hero_images/', blank=True, null=True)
    author = models.ForeignKey(
        TeamMember, 
        on_delete=models.CASCADE, 
        related_name='blog_posts'
    )
    
    # Publishing & Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    
    # Engagement Metrics
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    
    # Content Quality
    reading_time = models.PositiveIntegerField(
        default=0,
        help_text='Estimated reading time in minutes'
    )
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        default='intermediate'
    )
    
    # Timestamps
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
        
        # Auto-calculate reading time if not set
        if not self.reading_time:
            words_per_minute = 200
            word_count = len(self.body.split())
            self.reading_time = max(1, round(word_count / words_per_minute))
        
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
        if self.author:
            # Map role values to display names
            role_map = {
                'ceo': 'CEO & Founder',
                'cto': 'CTO',
                'developer': 'Lead Developer',
                'designer': 'UI/UX Designer',
                'devops': 'DevOps Engineer',
                'pm': 'Product Manager',
                'qa': 'QA Engineer',
                'intern': 'Intern'
            }
            return role_map.get(self.author.role, self.author.role.title())
        return ''
    
    @property
    def author_avatar(self):
        """Return the author's avatar URL."""
        if self.author and self.author.avatar:
            return self.author.avatar.url
        return None
    
    @property
    def display_seo_title(self):
        """Return SEO title or fallback to regular title."""
        return self.seo_title if self.seo_title else self.title
    
    @property
    def display_seo_description(self):
        """Return SEO description or fallback to summary."""
        return self.seo_description if self.seo_description else self.summary
    
    @property
    def is_published(self):
        """Check if post is published and visible."""
        return (
            self.status == 'published' and 
            self.published_at is not None and
            self.published_at <= timezone.now()
        )
    
    @property
    def engagement_score(self):
        """Calculate engagement score based on metrics."""
        return (self.view_count * 1) + (self.like_count * 2) + (self.share_count * 3) + (self.comment_count * 2)
    
    def increment_view_count(self):
        """Increment view count."""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def get_related_posts(self, limit=3):
        """Get related posts based on category and tags."""
        related = BlogPost.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).exclude(id=self.id)
        
        # Filter by same category first
        category_posts = related.filter(category=self.category)
        
        # Then by shared tags
        tag_posts = related.filter(tags__overlap=self.tags)
        
        # Combine and return unique posts
        all_related = list(category_posts) + list(tag_posts)
        unique_related = list({post.id: post for post in all_related}.values())
        
        return unique_related[:limit]
