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

