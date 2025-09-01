from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


class ResourceCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    color = models.CharField(max_length=20, default='bg-gray-500')
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Resource Categories'
    
    def __str__(self):
        return self.name


class ResourceType(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, default='BookOpen')
    color = models.CharField(max_length=50, default='from-gray-500 to-gray-600')
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Resource Types'
    
    def __str__(self):
        return self.name


class Resource(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    long_description = models.TextField(blank=True)
    
    # Categorization
    type = models.ForeignKey(ResourceType, on_delete=models.CASCADE, related_name='resources')
    category = models.ForeignKey(ResourceCategory, on_delete=models.CASCADE, related_name='resources')
    
    # Content
    tags = models.JSONField(default=list, blank=True)
    file_size = models.CharField(max_length=20, blank=True)
    format = models.CharField(max_length=20, blank=True)
    estimated_time = models.CharField(max_length=50, blank=True)
    
    # Media
    thumbnail = models.ImageField(upload_to='resources/thumbnails/', blank=True, null=True)
    file = models.FileField(upload_to='resources/files/', blank=True, null=True)
    external_url = models.URLField(blank=True)
    
    # Metadata
    author = models.CharField(max_length=100, default='KKEVO Team')
    is_featured = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Statistics
    download_count = models.PositiveIntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)]
    )
    rating_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-is_featured', 'order', '-published_at']
        verbose_name_plural = 'Resources'
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return f'/resources/{self.slug}/'
    
    def update_rating(self, new_rating):
        """Update the average rating when a new rating is added"""
        if self.rating_count == 0:
            self.rating = new_rating
        else:
            total_rating = (self.rating * self.rating_count) + new_rating
            self.rating_count += 1
            self.rating = total_rating / self.rating_count
        self.save()
    
    def increment_download(self):
        """Increment download count"""
        self.download_count += 1
        self.save()
    
    def increment_view(self):
        """Increment view count"""
        self.view_count += 1
        self.save()


class ResourceDownload(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='downloads')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resource_downloads', null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    downloaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-downloaded_at']
        verbose_name_plural = 'Resource Downloads'
    
    def __str__(self):
        return f"{self.resource.title} - {self.downloaded_at}"


class ResourceRating(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resource_ratings', null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Resource Ratings'
        unique_together = ['resource', 'user']  # One rating per user per resource
    
    def __str__(self):
        return f"{self.resource.title} - {self.rating} stars"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            # Update the resource's average rating
            self.resource.update_rating(self.rating)


class ResourceView(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resource_views', null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-viewed_at']
        verbose_name_plural = 'Resource Views'
    
    def __str__(self):
        return f"{self.resource.title} - {self.viewed_at}"

