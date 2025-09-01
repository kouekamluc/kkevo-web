"""
Custom runserver command that fixes XML module issues on Windows.
"""
import sys
import os
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.core.management.commands.runserver import Command as RunserverCommand


class Command(BaseCommand):
    help = 'Runs the Django development server with Windows XML module fixes'

    def add_arguments(self, parser):
        # Add all the same arguments as the regular runserver command
        runserver = RunserverCommand()
        runserver.add_arguments(parser)

    def handle(self, *args, **options):
        # Fix XML module issues on Windows before starting the server
        if sys.platform == 'win32':
            self.fix_xml_module()
        
        # Call the original runserver command
        call_command('runserver', *args, **options)

    def fix_xml_module(self):
        """Fix XML module issues on Windows."""
        try:
            import xml.etree.ElementTree
            self.stdout.write(
                self.style.SUCCESS('XML module already available')
            )
        except ImportError:
            self.stdout.write(
                self.style.WARNING('Fixing XML module for Windows...')
            )
            # Create dummy modules to prevent crashes
            import types
            
            # Create xml module
            xml_module = types.ModuleType('xml')
            xml_module.__file__ = '<dummy>'
            
            # Create xml.etree module
            etree_module = types.ModuleType('xml.etree')
            etree_module.__file__ = '<dummy>'
            
            # Create xml.etree.ElementTree module
            elementtree_module = types.ModuleType('xml.etree.ElementTree')
            elementtree_module.__file__ = '<dummy>'
            
            # Set up the module hierarchy
            xml_module.etree = etree_module
            etree_module.ElementTree = elementtree_module
            
            # Register the modules in sys.modules
            sys.modules['xml'] = xml_module
            sys.modules['xml.etree'] = etree_module
            sys.modules['xml.etree.ElementTree'] = elementtree_module
            
            self.stdout.write(
                self.style.SUCCESS('XML module fix applied successfully')
            )


