"""
Lead magnets app configuration.
"""
from django.apps import AppConfig


class LeadMagnetsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lead_magnets'
    verbose_name = 'Lead Magnets'
    
    def ready(self):
        """Import signals when app is ready."""
        try:
            import lead_magnets.signals
        except ImportError:
            pass
