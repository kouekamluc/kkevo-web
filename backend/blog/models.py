"""
Blog models for KKEVO.
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
from django.utils.text import slugify
from team.models import TeamMember
from django.utils import timezone
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, unique=True)
    color = models.CharField(max_length=20, default='bg-blue-500')
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Blog Categories'
    
    def __str__(self):
        return self.name


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
        ('scheduled', 'Scheduled'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    # Core fields that exist in database
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    summary = models.TextField(blank=True)  # Database has this
    body = models.TextField()  # Database has this
    excerpt = models.TextField(blank=True)  # Database has this too
    
    # Author and metadata
    author = models.ForeignKey('team.TeamMember', on_delete=models.DO_NOTHING, related_name='blog_posts')
    
    # Category - use the existing varchar field for now
    category = models.CharField(max_length=20, blank=True)  # Database has this as varchar
    new_category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    
    tags = models.JSONField(default=list, blank=True)
    
    # Publishing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    hero_image = models.CharField(max_length=100, blank=True)  # Database has this
    featured_image = models.CharField(max_length=100, blank=True)  # Database has this too
    published_at = models.DateTimeField(default=timezone.now)
    
    # SEO and display
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    seo_title = models.CharField(max_length=60, blank=True)
    seo_description = models.TextField(blank=True)
    seo_keywords = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # Engagement tracking
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    bookmark_count = models.PositiveIntegerField(default=0)
    share_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    
    # Reading metrics
    reading_time = models.PositiveIntegerField(default=5)  # Database has this
    estimated_reading_time = models.PositiveIntegerField(default=5, help_text='Estimated reading time in minutes')
    word_count = models.PositiveIntegerField(default=0)
    
    # Additional fields that exist in database
    canonical_url = models.CharField(max_length=200, blank=True)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    related_services = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'order', '-published_at']
        verbose_name_plural = 'Blog Posts'
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return f"/blog/{self.slug}/"
    
    # Add properties to maintain compatibility with frontend
    @property
    def content(self):
        return self.body
    
    def increment_view(self):
        """Increment view count"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def increment_like(self):
        """Increment like count"""
        self.like_count += 1
        self.save(update_fields=['like_count'])
    
    def decrement_like(self):
        """Decrement like count"""
        if self.like_count > 0:
            self.like_count -= 1
            self.save(update_fields=['like_count'])
    
    def increment_bookmark(self):
        """Increment bookmark count"""
        self.bookmark_count += 1
        self.save(update_fields=['bookmark_count'])
    
    def decrement_bookmark(self):
        """Decrement bookmark count"""
        if self.bookmark_count > 0:
            self.bookmark_count -= 1
            self.save(update_fields=['bookmark_count'])
    
    def increment_share(self):
        """Increment share count"""
        self.share_count += 1
        self.save(update_fields=['share_count'])
    
    def save(self, *args, **kwargs):
        # Calculate word count before saving
        if self.body:
            self.word_count = len(self.body.split())
            # Estimate reading time (average 200 words per minute)
            self.estimated_reading_time = max(1, round(self.word_count / 200))
        super().save(*args, **kwargs)


class BlogPostView(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='blog_views')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.CharField(max_length=200, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-viewed_at']
        verbose_name_plural = 'Blog Post Views'
    
    def __str__(self):
        return f"{self.post.title} - {self.viewed_at}"


class BlogPostLike(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='blog_likes',
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    liked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-liked_at']
        verbose_name_plural = 'Blog Post Likes'
        unique_together = [['post', 'user']]
    
    def __str__(self):
        return f"{self.user.username} liked {self.post.title} - {self.liked_at}"


class BlogPostBookmark(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='blog_bookmarks',
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    bookmarked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-bookmarked_at']
        verbose_name_plural = 'Blog Post Bookmarks'
        unique_together = [['post', 'user']]
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.post.title} - {self.bookmarked_at}"


class BlogPostShare(models.Model):
    SHARE_PLATFORMS = [
        ('twitter', 'Twitter'),
        ('facebook', 'Facebook'),
        ('linkedin', 'LinkedIn'),
        ('email', 'Email'),
        ('copy_link', 'Copy Link'),
        ('other', 'Other'),
    ]
    
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='blog_shares',
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    platform = models.CharField(max_length=20, choices=SHARE_PLATFORMS)
    shared_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-shared_at']
        verbose_name_plural = 'Blog Post Shares'
    
    def __str__(self):
        return f"{self.user.username} shared {self.post.title} on {self.platform} - {self.shared_at}"


class BlogTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#6B7280')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Blog Tags'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPostComment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    content = models.TextField()
    is_approved = models.BooleanField(default=False)
    is_moderated = models.BooleanField(default=False)
    moderated_at = models.DateTimeField(null=True, blank=True)
    moderation_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Blog Post Comments'
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"
    
    @property
    def is_reply(self):
        return self.parent is not None
    
    @property
    def reply_count(self):
        return self.replies.filter(is_approved=True).count()


class UserReadingProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_progress')
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='reading_progress')
    progress_percentage = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0
    )
    time_spent = models.PositiveIntegerField(default=0, help_text="Time spent in seconds")
    last_position = models.PositiveIntegerField(default=0, help_text="Last scroll position")
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_read_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'post']
        ordering = ['-last_read_at']
        verbose_name_plural = 'User Reading Progress'
    
    def __str__(self):
        return f"{self.user.username} - {self.post.title} ({self.progress_percentage}%)"
    
    def update_progress(self, percentage, time_spent=0, position=0):
        self.progress_percentage = min(100, max(0, percentage))
        self.time_spent += time_spent
        self.last_position = position
        
        if self.progress_percentage >= 90:  # Consider 90% as completed
            self.is_completed = True
            if not self.completed_at:
                self.completed_at = timezone.now()
        
        self.save()


class BlogPostAnalytics(models.Model):
    post = models.OneToOneField(BlogPost, on_delete=models.CASCADE, related_name='analytics')
    
    # Engagement Metrics
    unique_views = models.PositiveIntegerField(default=0)
    returning_visitors = models.PositiveIntegerField(default=0)
    bounce_rate = models.FloatField(default=0.0, help_text="Bounce rate as percentage")
    
    # Reading Behavior
    average_time_on_page = models.FloatField(default=0.0, help_text="Average time in seconds")
    average_scroll_depth = models.FloatField(default=0.0, help_text="Average scroll depth as percentage")
    completion_rate = models.FloatField(default=0.0, help_text="Completion rate as percentage")
    
    # Social Metrics
    social_shares = models.JSONField(default=dict, help_text="Shares by platform")
    social_clicks = models.JSONField(default=dict, help_text="Clicks by platform")
    
    # SEO Metrics
    search_impressions = models.PositiveIntegerField(default=0)
    search_clicks = models.PositiveIntegerField(default=0)
    ctr = models.FloatField(default=0.0, help_text="Click-through rate")
    
    # Conversion Metrics
    lead_generations = models.PositiveIntegerField(default=0)
    newsletter_signups = models.PositiveIntegerField(default=0)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Blog Post Analytics'
    
    def __str__(self):
        return f"Analytics for {self.post.title}"
    
    def calculate_metrics(self):
        """Calculate and update analytics metrics"""
        views = self.post.views.all()
        
        if views.exists():
            # Calculate unique views
            unique_ips = views.values('ip_address').distinct().count()
            self.unique_views = unique_ips
            
            # Calculate bounce rate (single page visits)
            single_page_visits = views.filter(
                user__isnull=True
            ).values('ip_address').annotate(
                visit_count=models.Count('id')
            ).filter(visit_count=1).count()
            
            if unique_ips > 0:
                self.bounce_rate = (single_page_visits / unique_ips) * 100
            
            # Calculate average time and scroll depth from reading progress
            progress_records = self.post.reading_progress.all()
            if progress_records.exists():
                self.average_time_on_page = progress_records.aggregate(
                    avg_time=models.Avg('time_spent')
                )['avg_time'] or 0
                
                self.average_scroll_depth = progress_records.aggregate(
                    avg_depth=models.Avg('progress_percentage')
                )['avg_depth'] or 0
                
                completed_count = progress_records.filter(is_completed=True).count()
                self.completion_rate = (completed_count / progress_records.count()) * 100
            
            self.save()
