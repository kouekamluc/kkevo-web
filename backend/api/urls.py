"""
API URLs for KKEVO project.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from services.views import ServiceViewSet, CompanyStatsViewSet, CompanyConfigViewSet
from team.views import TeamMemberViewSet
from testimonials.views import TestimonialViewSet
from contact.views import ContactSubmissionViewSet
# from authentication.test_auth import auth_test_public, auth_test_protected, auth_test_admin
from portfolio.views import PortfolioViewSet
from lead_magnets.views import LeadMagnetSubmissionViewSet
from case_studies.views import CaseStudyViewSet
from resources.views import ResourceViewSet, ResourceCategoryViewSet, ResourceTypeViewSet
from . import views

# Create router and register viewsets
router = DefaultRouter()
router.register(r'stats', CompanyStatsViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'contact', ContactSubmissionViewSet)
router.register(r'config', CompanyConfigViewSet)
router.register(r'lead-magnets', LeadMagnetSubmissionViewSet)

app_name = 'api'

urlpatterns = [
    # Health check endpoint
    path('healthz/', views.health_check, name='health-check'),
    
    # Auth0 test endpoints
    path('auth/test/public/', views.auth_test_public, name='auth-test-public'),
    path('auth/test/protected/', views.auth_test_protected, name='auth-test-protected'),
    path('auth/test/admin/', views.auth_test_admin, name='auth-test-admin'),
    
    # Services with slug-based lookups
    path('services/', ServiceViewSet.as_view({'get': 'list'}), name='service-list'),
    path('services/<slug:slug>/', ServiceViewSet.as_view({'get': 'retrieve'}), name='service-detail'),
    
    # Include blog URLs (temporarily using original)
    path('blog/', include('blog.urls')),
    
    # Portfolio items with slug-based lookups
    path('portfolio/', PortfolioViewSet.as_view({'get': 'list'}), name='portfolio-list'),
    path('portfolio/<slug:slug>/', PortfolioViewSet.as_view({'get': 'retrieve'}), name='portfolio-detail'),
    
    # Case studies with slug-based lookups
    path('case-studies/', CaseStudyViewSet.as_view({'get': 'list'}), name='case-study-list'),
    path('case-studies/<slug:slug>/', CaseStudyViewSet.as_view({'get': 'retrieve'}), name='case-study-detail'),
    
    # Resources with slug-based lookups
    path('resources/', ResourceViewSet.as_view({'get': 'list'}), name='resource-list'),
    path('resources/<slug:slug>/', ResourceViewSet.as_view({'get': 'retrieve'}), name='resource-detail'),
    
    # Include router for other endpoints
    path('', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api:schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api:schema'), name='redoc'),
    path('auth/', include('rest_framework.urls')),
]
