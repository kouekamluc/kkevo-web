"""
URL patterns for lead magnets app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadMagnetSubmissionViewSet

router = DefaultRouter()
router.register(r'submissions', LeadMagnetSubmissionViewSet)

app_name = 'lead_magnets'

urlpatterns = [
    path('', include(router.urls)),
]
