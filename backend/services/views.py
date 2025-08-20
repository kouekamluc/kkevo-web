"""
Views for services app.
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Service, CompanyStats
from .serializers import ServiceSerializer, ServiceListSerializer, CompanyStatsSerializer


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
    
    def retrieve(self, request, slug=None):
        """Retrieve a service by slug."""
        service = get_object_or_404(Service, slug=slug, is_active=True)
        serializer = self.get_serializer(service)
        return Response(serializer.data)


class CompanyStatsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for CompanyStats model."""
    
    queryset = CompanyStats.objects.filter(is_active=True)
    serializer_class = CompanyStatsSerializer
    ordering = ['order', 'name']
    
    def get_queryset(self):
        """Return filtered queryset."""
        try:
            queryset = super().get_queryset()
            
            # Apply ordering BEFORE any slicing
            ordering = self.request.query_params.get('ordering', None)
            if ordering:
                queryset = queryset.order_by(ordering)
            else:
                # Use default ordering
                queryset = queryset.order_by('order', 'name')
            
            # Limit results if specified (apply AFTER ordering)
            limit = self.request.query_params.get('limit', None)
            if limit:
                try:
                    limit = int(limit)
                    queryset = queryset[:limit]
                except ValueError:
                    pass
            
            return queryset
        except Exception as e:
            # Log the error and return empty queryset
            print(f"Error in CompanyStatsViewSet: {e}")
            return CompanyStats.objects.none()
    
    def list(self, request, *args, **kwargs):
        """Override list method to provide fallback data if database is empty."""
        try:
            queryset = self.get_queryset()
            if queryset.exists():
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)
            else:
                # Return fallback stats if database is empty
                fallback_stats = [
                    {
                        'id': 'fallback-1',
                        'name': 'projects',
                        'value': 150,
                        'suffix': '+',
                        'label': 'Projects Delivered',
                        'description': 'Successfully completed projects across various industries',
                        'icon_name': 'rocket',
                        'color_scheme': 'from-blue-500 to-cyan-500',
                        'order': 1,
                        'is_active': True
                    },
                    {
                        'id': 'fallback-2',
                        'name': 'clients',
                        'value': 50,
                        'suffix': '+',
                        'label': 'Happy Clients',
                        'description': 'Satisfied clients who trust us with their digital transformation',
                        'icon_name': 'users',
                        'color_scheme': 'from-green-500 to-emerald-500',
                        'order': 2,
                        'is_active': True
                    },
                    {
                        'id': 'fallback-3',
                        'name': 'experience',
                        'value': 8,
                        'suffix': '+',
                        'label': 'Years Experience',
                        'description': 'Deep expertise in modern software development technologies',
                        'icon_name': 'clock',
                        'color_scheme': 'from-purple-500 to-pink-500',
                        'order': 3,
                        'is_active': True
                    },
                    {
                        'id': 'fallback-4',
                        'name': 'satisfaction',
                        'value': 99,
                        'suffix': '%',
                        'label': 'Client Satisfaction',
                        'description': 'Consistently high satisfaction ratings from our clients',
                        'icon_name': 'award',
                        'color_scheme': 'from-yellow-500 to-orange-500',
                        'order': 4,
                        'is_active': True
                    }
                ]
                return Response(fallback_stats)
        except Exception as e:
            print(f"Error in CompanyStatsViewSet.list: {e}")
            # Return fallback data on any error
            fallback_stats = [
                {
                    'id': 'error-fallback-1',
                    'name': 'projects',
                    'value': 150,
                    'suffix': '+',
                    'label': 'Projects Delivered',
                    'description': 'Successfully completed projects across various industries',
                    'icon_name': 'rocket',
                    'color_scheme': 'from-blue-500 to-cyan-500',
                    'order': 1,
                    'is_active': True
                },
                {
                    'id': 'error-fallback-2',
                    'name': 'clients',
                    'value': 50,
                    'suffix': '+',
                    'label': 'Happy Clients',
                    'description': 'Satisfied clients who trust us with their digital transformation',
                    'icon_name': 'users',
                    'color_scheme': 'from-green-500 to-emerald-500',
                    'order': 2,
                    'is_active': True
                }
            ]
            return Response(fallback_stats, status=200)
