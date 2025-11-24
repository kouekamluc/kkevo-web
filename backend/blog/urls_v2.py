from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views_v2

router = DefaultRouter()
router.register(r'categories', views_v2.BlogCategoryViewSet, basename='blogcategory')
router.register(r'posts', views_v2.BlogPostViewSet, basename='blogpost')
router.register(r'tags', views_v2.BlogTagViewSet, basename='blogtag')
router.register(r'comments', views_v2.BlogPostCommentViewSet, basename='blogpostcomment')
router.register(r'reading-progress', views_v2.UserReadingProgressViewSet, basename='userreadingprogress')

urlpatterns = [
    path('', include(router.urls)),
    # Keep the health check from the original views
    path('health/', views_v2.BlogHealthCheckView.as_view(), name='blog_health'),
]

