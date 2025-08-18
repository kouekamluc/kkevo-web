from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet

router = DefaultRouter()
router.register(r'portfolio', PortfolioViewSet)

app_name = 'portfolio'

urlpatterns = [
    path('', include(router.urls)),
]
