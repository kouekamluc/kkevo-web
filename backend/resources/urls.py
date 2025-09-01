from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResourceViewSet, ResourceCategoryViewSet, ResourceTypeViewSet,
    ResourceDownloadViewSet, ResourceRatingViewSet, ResourceViewViewSet
)

router = DefaultRouter()
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'categories', ResourceCategoryViewSet, basename='resource-category')
router.register(r'types', ResourceTypeViewSet, basename='resource-type')
router.register(r'downloads', ResourceDownloadViewSet, basename='resource-download')
router.register(r'ratings', ResourceRatingViewSet, basename='resource-rating')
router.register(r'views', ResourceViewViewSet, basename='resource-view')

urlpatterns = [
    path('', include(router.urls)),
]

