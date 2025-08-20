#!/usr/bin/env python
"""
Script to check what hero images are currently stored in the database.
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from blog.models import BlogPost

def check_hero_images():
    """Check what hero images are stored in the database."""
    try:
        blog_posts = BlogPost.objects.all()
        
        if blog_posts.count() == 0:
            print("No blog posts found in database.")
            return
        
        print(f"Found {blog_posts.count()} blog posts:")
        print("-" * 50)
        
        for post in blog_posts:
            print(f"Title: {post.title}")
            print(f"Hero Image: '{post.hero_image}'")
            if post.hero_image:
                print(f"Full URL: http://localhost:8081{post.hero_image}")
            else:
                print("No hero image set")
            print("-" * 50)
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    print("🔍 Checking hero images in database...")
    check_hero_images()
