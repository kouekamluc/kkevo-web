"""
Views for services app.
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service
from .serializers import ServiceSerializer, ServiceListSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Service model."""
    
    queryset = Service.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['title', 'short_desc', 'long_desc']
    ordering_fields = ['order', 'title', 'created_at']
    ordering = ['order', 'title']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return ServiceListSerializer
        return ServiceSerializer
    
    def get_queryset(self):
        """Return filtered queryset."""
        queryset = super().get_queryset()
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
