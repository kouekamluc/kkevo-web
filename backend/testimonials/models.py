"""
Testimonial models for KKEVO.
"""
import uuid
from django.db import models


class Testimonial(models.Model):
    """Testimonial model for KKEVO."""
    
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True)
    quote = models.TextField()
    logo = models.ImageField(upload_to='testimonials/logos/', blank=True, null=True)
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
    
    def __str__(self):
        company_text = f" from {self.company}" if self.company else ""
        return f"{self.client}{company_text} - {self.rating} stars"
    
    @property
    def logo_url(self):
        """Return the logo URL."""
        if self.logo:
            return self.logo.url
        return None
    
    @property
    def rating_stars(self):
        """Return rating as stars string."""
        return "★" * self.rating + "☆" * (5 - self.rating)
