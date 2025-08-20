from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Portfolio
from .serializers import PortfolioSerializer, PortfolioListSerializer


# Create your views here.

class PortfolioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for portfolio projects.
    Read-only for public access.
    """
    queryset = Portfolio.objects.filter(status='published')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'client', 'year', 'is_featured', 'status']
    search_fields = ['title', 'description', 'long_description', 'technologies']
    ordering_fields = ['order', 'created_at', 'year']
    ordering = ['order', '-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioListSerializer
        return PortfolioSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category if specified
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by featured projects
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            featured_bool = featured.lower() == 'true'
            queryset = queryset.filter(is_featured=featured_bool)
        
        # Apply ordering
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            queryset = queryset.order_by(ordering)
        else:
            # Use default ordering
            queryset = queryset.order_by('order', '-created_at')
        
        return queryset
    
    def retrieve(self, request, slug=None):
        """Retrieve a portfolio item by slug."""
        portfolio_item = get_object_or_404(Portfolio, slug=slug, status='published')
        serializer = self.get_serializer(portfolio_item)
        return Response(serializer.data)
