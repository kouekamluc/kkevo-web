"""
Views for testimonials app.
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Testimonial
from .serializers import TestimonialSerializer, TestimonialListSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Testimonial model."""
    
    queryset = Testimonial.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['rating', 'is_active']
    search_fields = ['client', 'company', 'quote']
    ordering_fields = ['order', 'rating', 'created_at']
    ordering = ['order', '-rating']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return TestimonialListSerializer
        return TestimonialSerializer
    
    def get_queryset(self):
        """Return filtered queryset."""
        queryset = super().get_queryset()
        
        # Filter by rating if provided
        rating = self.request.query_params.get('rating', None)
        if rating:
            queryset = queryset.filter(rating=rating)
        
        return queryset
