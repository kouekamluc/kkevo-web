from django.urls import path
from . import views

app_name = 'resources'

urlpatterns = [
    path('django-saas-checklist/download/', views.DjangoSaasChecklistDownloadView.as_view(), name='django_saas_checklist_download'),
    path('django-saas-checklist/download-fallback/', views.django_saas_checklist_download_fallback, name='django_saas_checklist_download_fallback'),
]

