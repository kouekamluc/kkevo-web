"""
API URLs for KKEVO project.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from services.views import ServiceViewSet, CompanyStatsViewSet
from team.views import TeamMemberViewSet
from testimonials.views import TestimonialViewSet
from contact.views import ContactSubmissionViewSet
from blog.views import BlogPostViewSet
from portfolio.views import PortfolioViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'stats', CompanyStatsViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'contact', ContactSubmissionViewSet)

app_name = 'api'

urlpatterns = [
    # Services with slug-based lookups
    path('services/', ServiceViewSet.as_view({'get': 'list'}), name='service-list'),
    path('services/<slug:slug>/', ServiceViewSet.as_view({'get': 'retrieve'}), name='service-detail'),
    
    # Blog posts with slug-based lookups
    path('blog/', BlogPostViewSet.as_view({'get': 'list'}), name='blogpost-list'),
    path('blog/<slug:slug>/', BlogPostViewSet.as_view({'get': 'retrieve'}), name='blogpost-detail'),
    
    # Portfolio items with slug-based lookups
    path('portfolio/', PortfolioViewSet.as_view({'get': 'list'}), name='portfolio-list'),
    path('portfolio/<slug:slug>/', PortfolioViewSet.as_view({'get': 'retrieve'}), name='portfolio-detail'),
    
    # Include router for other endpoints
    path('', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api:schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api:schema'), name='redoc'),
    path('auth/', include('rest_framework.urls')),
]
