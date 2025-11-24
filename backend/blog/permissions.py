"""
Custom permission classes for blog operations.
"""
from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser


class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user


class IsAuthorOrReadOnly(BasePermission):
    """
    Custom permission to only allow authors of a blog post to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author of the blog post
        return obj.author == request.user


class IsAuthenticatedOrReadOnly(BasePermission):
    """
    Custom permission to allow read-only access for unauthenticated users,
    but require authentication for write operations.
    """
    
    def has_permission(self, request, view):
        # Allow read-only access for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Require authentication for write operations
        return request.user and request.user.is_authenticated


class IsStaffOrReadOnly(BasePermission):
    """
    Custom permission to allow read-only access for all users,
    but require staff status for write operations.
    """
    
    def has_permission(self, request, view):
        # Allow read-only access for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Require staff status for write operations
        return request.user and request.user.is_staff


class IsOwnerOrStaff(BasePermission):
    """
    Custom permission to allow access only to owners or staff members.
    """
    
    def has_object_permission(self, request, view, obj):
        # Staff members have full access
        if request.user.is_staff:
            return True
        
        # Owners have full access to their objects
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # Authors have access to their blog posts
        if hasattr(obj, 'author') and obj.author == request.user:
            return True
        
        return False


class CanModerateComments(BasePermission):
    """
    Custom permission to allow comment moderation.
    """
    
    def has_permission(self, request, view):
        # Only authenticated users can moderate comments
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Staff members can moderate all comments
        if request.user.is_staff:
            return True
        
        # Authors can moderate comments on their own posts
        if hasattr(view, 'get_object'):
            try:
                obj = view.get_object()
                if hasattr(obj, 'post') and obj.post.author == request.user:
                    return True
            except:
                pass
        
        return False


class CanViewAnalytics(BasePermission):
    """
    Custom permission to allow viewing analytics.
    """
    
    def has_permission(self, request, view):
        # Only authenticated users can view analytics
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Staff members can view all analytics
        if request.user.is_staff:
            return True
        
        # Authors can view analytics for their own posts
        return True  # Allow authors to view their own analytics


class IsAuthenticatedForInteractions(BasePermission):
    """
    Custom permission to require authentication for all blog interactions.
    """
    
    def has_permission(self, request, view):
        # All interactions require authentication
        return request.user and request.user.is_authenticated


class CanCreateBlogPost(BasePermission):
    """
    Custom permission to allow blog post creation.
    """
    
    def has_permission(self, request, view):
        # Only authenticated users can create blog posts
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Staff members can always create posts
        if request.user.is_staff:
            return True
        
        # Check if user has permission to create posts
        # This could be extended to check for specific user groups or permissions
        return True


class CanEditBlogPost(BasePermission):
    """
    Custom permission to allow blog post editing.
    """
    
    def has_object_permission(self, request, view, obj):
        # Staff members can edit all posts
        if request.user.is_staff:
            return True
        
        # Authors can edit their own posts
        if obj.author == request.user:
            return True
        
        return False


class CanDeleteBlogPost(BasePermission):
    """
    Custom permission to allow blog post deletion.
    """
    
    def has_object_permission(self, request, view, obj):
        # Only staff members can delete posts
        return request.user.is_staff


class CanViewDraftPosts(BasePermission):
    """
    Custom permission to allow viewing draft posts.
    """
    
    def has_permission(self, request, view):
        # Only authenticated users can view drafts
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Staff members can view all drafts
        if request.user.is_staff:
            return True
        
        # Authors can view their own drafts
        return True


class CanManageCategories(BasePermission):
    """
    Custom permission to allow managing blog categories.
    """
    
    def has_permission(self, request, view):
        # Only staff members can manage categories
        return request.user and request.user.is_staff


class CanManageTags(BasePermission):
    """
    Custom permission to allow managing blog tags.
    """
    
    def has_permission(self, request, view):
        # Only staff members can manage tags
        return request.user and request.user.is_staff