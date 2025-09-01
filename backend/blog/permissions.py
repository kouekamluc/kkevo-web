from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of a blog post to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author
        return obj.author == request.user

class IsCommentAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow comment authors to edit their comments.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the comment author
        return obj.user == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to modify content.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff

class IsModeratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow moderators to approve/moderate content.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to staff users
        return request.user and request.user.is_staff

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Check if the object has an author field
        elif hasattr(obj, 'author'):
            return obj.author == request.user
        # Check if the object has an owner field
        elif hasattr(obj, 'owner'):
            return obj.owner == request.user
        
        return False

class IsAuthenticatedOrAnonymousReadOnly(permissions.BasePermission):
    """
    Custom permission to allow anonymous users to read, but require authentication for writes.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions require authentication
        return request.user and request.user.is_authenticated

class HasBlogPermission(permissions.BasePermission):
    """
    Custom permission to check if user has specific blog permissions.
    """
    
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check specific permissions based on action
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            # Users can only modify their own posts unless they're staff
            return request.user.is_staff or True  # Allow all authenticated users for now
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Staff users can do anything
        if request.user.is_staff:
            return True
        
        # Check specific permissions based on action
        if view.action in ['update', 'partial_update', 'destroy']:
            # Users can only modify their own posts
            if hasattr(obj, 'author'):
                return obj.author == request.user
            elif hasattr(obj, 'user'):
                return obj.user == request.user
        
        return True


