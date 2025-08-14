"""
API URLs for KKEVO project.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from services.views import ServiceViewSet
from team.views import TeamMemberViewSet
from testimonials.views import TestimonialViewSet
from contact.views import ContactSubmissionViewSet
from blog.views import BlogPostViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'contact', ContactSubmissionViewSet)
router.register(r'blog', BlogPostViewSet)

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api:schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api:schema'), name='redoc'),
    path('auth/', include('rest_framework.urls')),
]
