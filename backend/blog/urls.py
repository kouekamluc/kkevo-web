from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.BlogCategoryViewSet, basename='blogcategory')
router.register(r'posts', views.BlogPostViewSet, basename='blogpost')
router.register(r'views', views.BlogPostViewViewSet, basename='blogpostview')
router.register(r'likes', views.BlogPostLikeViewSet, basename='blogpostlike')
router.register(r'bookmarks', views.BlogPostBookmarkViewSet, basename='blogpostbookmark')
router.register(r'shares', views.BlogPostShareViewSet, basename='blogpostshare')
router.register(r'tags', views.BlogTagViewSet, basename='blogtag')
router.register(r'comments', views.BlogPostCommentViewSet, basename='blogpostcomment')
router.register(r'reading-progress', views.UserReadingProgressViewSet, basename='userreadingprogress')
router.register(r'analytics', views.BlogPostAnalyticsViewSet, basename='blogpostanalytics')

urlpatterns = [
    path('', include(router.urls)),
    path('upload-image/', views.ImageUploadView.as_view(), name='upload_image'),
]
