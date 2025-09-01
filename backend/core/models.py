"""
Custom models for the core app.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model with Auth0 integration.
    """
    auth0_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    avatar = models.URLField(max_length=500, null=True, blank=True)
    
    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username or self.email






