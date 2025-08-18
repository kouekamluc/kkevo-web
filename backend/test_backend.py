#!/usr/bin/env python
"""
Simple test script to verify backend functionality
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from django.core.management import execute_from_command_line

if __name__ == '__main__':
    print("Testing backend...")
    try:
        # Try to run the seed command
        execute_from_command_line(['manage.py', 'seed_demo'])
        print("✅ Backend test completed successfully!")
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        sys.exit(1)
