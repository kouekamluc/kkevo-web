#!/usr/bin/env python
"""
Script to clear all hero images from blog posts in the database.
Run this to reset all hero_image fields so you can upload new ones via Django admin.
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from blog.models import BlogPost

def clear_all_hero_images():
    """Clear all hero_image fields from blog posts."""
    try:
        # Get all blog posts
        blog_posts = BlogPost.objects.all()
        count = blog_posts.count()
        
        if count == 0:
            print("No blog posts found in database.")
            return
        
        # Clear all hero_image fields
        updated_count = blog_posts.update(hero_image='')
        
        print(f"✅ Successfully cleared hero images from {updated_count} blog posts!")
        print("You can now upload new images through Django admin.")
        
        # Show the updated blog posts
        print("\nUpdated blog posts:")
        for post in BlogPost.objects.all():
            print(f"- {post.title}: hero_image = '{post.hero_image}'")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("🧹 Clearing all hero images from blog posts...")
    success = clear_all_hero_images()
    
    if success:
        print("\n🎉 All done! You can now:")
        print("1. Go to Django admin (http://localhost:8081/admin/)")
        print("2. Edit each blog post")
        print("3. Upload new hero images")
        print("4. Save the changes")
    else:
        print("\n❌ Failed to clear hero images. Check the error above.")
        sys.exit(1)
