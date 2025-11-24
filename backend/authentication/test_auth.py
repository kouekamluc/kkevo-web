"""
Simple test endpoint to verify Auth0 authentication.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_test_public(request):
    """Public endpoint that anyone can access."""
    return Response({
        'message': 'Public endpoint - no authentication required',
        'user': 'Anonymous',
        'authenticated': False
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_test_protected(request):
    """Protected endpoint that requires authentication."""
    return Response({
        'message': 'Protected endpoint - authentication required',
        'user': request.user.username,
        'user_id': request.user.id,
        'authenticated': True,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
        'auth0_id': getattr(request.user, 'auth0_id', None)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_test_admin(request):
    """Admin-only endpoint."""
    if not request.user.is_staff:
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)
    
    return Response({
        'message': 'Admin endpoint - staff access required',
        'user': request.user.username,
        'user_id': request.user.id,
        'authenticated': True,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
        'auth0_id': getattr(request.user, 'auth0_id', None)
    })







