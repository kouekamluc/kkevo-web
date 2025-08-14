#!/usr/bin/env python
"""
Test script to verify database connection and models.
"""
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

# Test imports
from django.contrib.auth.models import User
from services.models import Service
from team.models import TeamMember
from blog.models import BlogPost
from testimonials.models import Testimonial
from contact.models import ContactSubmission

print("✅ Database connection successful!")
print(f"Users: {User.objects.count()}")
print(f"Services: {Service.objects.count()}")
print(f"Team Members: {TeamMember.objects.count()}")
print(f"Blog Posts: {BlogPost.objects.count()}")
print(f"Testimonials: {Testimonial.objects.count()}")
print(f"Contact Submissions: {ContactSubmission.objects.count()}")

# Test creating a sample service
if Service.objects.count() == 0:
    service = Service.objects.create(
        title="Web Development",
        slug="web-development",
        short_desc="Custom web applications",
        long_desc="We build modern, scalable web applications using the latest technologies.",
        features=["Responsive Design", "SEO Optimized", "Performance Focused"],
        order=1
    )
    print(f"✅ Created sample service: {service.title}")
else:
    print("✅ Services already exist in database")

print("\n🎉 Database setup complete!")
