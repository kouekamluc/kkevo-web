"""
Development Django settings for KKEVO project.
"""
from .base import *
from decouple import config
import sys
import os

# Fix for Windows XML module issue with Django autoreloader
if sys.platform == 'win32':
    try:
        import xml.etree.ElementTree
    except ImportError:
        # Create a dummy module to prevent Django autoreloader from crashing
        import types
        xml_module = types.ModuleType('xml')
        xml_module.etree = types.ModuleType('xml.etree')
        xml_module.etree.ElementTree = types.ModuleType('xml.etree.ElementTree')
        sys.modules['xml'] = xml_module
        sys.modules['xml.etree'] = xml_module.etree
        sys.modules['xml.etree.ElementTree'] = xml_module.etree.ElementTree

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1,0.0.0.0', cast=lambda v: [s.strip() for s in v.split(',')])

# Database configuration inherited from base.py (PostgreSQL)

# CORS settings for development
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
]

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Static files - Commented out due to compatibility issues
# STATICFILES_STORAGE = 'whitenoise.storage.WhiteNoiseStorage'

# Debug toolbar (only if installed) - Commented out to avoid issues
# if DEBUG:
#     try:
#         import debug_toolbar
#         INSTALLED_APPS += ['debug_toolbar']
#         MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
#         INTERNAL_IPS = ['127.0.0.1', '0.0.0.0']
#     except ImportError:
#         pass

# Django autoreloader settings to prevent XML module issues
if sys.platform == 'win32':
    # Disable file watching on Windows to prevent XML module issues
    USE_WATCHMAN = False
    # Alternative: Use a more robust file watching method
    FILE_UPLOAD_HANDLERS = [
        'django.core.files.uploadhandler.MemoryFileUploadHandler',
        'django.core.files.uploadhandler.TemporaryFileUploadHandler',
    ]
