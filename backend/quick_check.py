#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from blog.models import BlogPost

posts = BlogPost.objects.all()
print(f"Found {posts.count()} blog posts:")
for post in posts:
    print(f"- {post.title}")
    print(f"  hero_image: '{post.hero_image}'")
    print(f"  hero_image_url: '{post.hero_image_url}'")
    print()
