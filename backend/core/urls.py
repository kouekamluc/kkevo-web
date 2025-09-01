"""
URL configuration for KKEVO project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    path('api/v1/resources/', include('resources.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar URLs (only if installed) - Commented out to avoid issues
    # try:
    #     import debug_toolbar
    #     urlpatterns += [
    #         path('__debug__/', include(debug_toolbar.urls)),
    #     ]
    # except ImportError:
    #     pass
