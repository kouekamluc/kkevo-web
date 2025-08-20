from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CaseStudyViewSet

router = DefaultRouter()
router.register(r'case-studies', CaseStudyViewSet)

app_name = 'case_studies'

urlpatterns = [
    path('', include(router.urls)),
]
