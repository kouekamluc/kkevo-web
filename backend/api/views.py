from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone


@api_view(['GET', 'HEAD'])
def health_check(request):
    """Simple health check endpoint for monitoring"""
    return Response(
        {"status": "healthy", "timestamp": timezone.now().isoformat()},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def auth_test_public(request):
    """Public endpoint for testing Auth0 setup"""
    return Response({
        "message": "Public endpoint - no authentication required",
        "timestamp": timezone.now().isoformat(),
        "auth0_configured": bool(request.auth),
        "user": str(request.user) if request.user.is_authenticated else "Anonymous"
    })


@api_view(['GET'])
def auth_test_protected(request):
    """Protected endpoint for testing Auth0 authentication"""
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    return Response({
        "message": "Protected endpoint - authentication successful",
        "timestamp": timezone.now().isoformat(),
        "user": {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
            "auth0_id": getattr(request.user, 'auth0_id', None)
        }
    })


@api_view(['GET'])
def auth_test_admin(request):
    """Admin-only endpoint for testing Auth0 roles"""
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not request.user.is_staff:
        return Response(
            {"error": "Staff access required"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    return Response({
        "message": "Admin endpoint - staff access successful",
        "timestamp": timezone.now().isoformat(),
        "user": {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
            "auth0_id": getattr(request.user, 'auth0_id', None)
        }
    })





