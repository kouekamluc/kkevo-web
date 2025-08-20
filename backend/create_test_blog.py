#!/usr/bin/env python
"""
Simple script to create test blog posts.
Run this to quickly create test posts for frontend testing.
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from blog.models import BlogPost
from team.models import TeamMember

def create_test_blog_posts():
    """Create test blog posts for frontend testing."""
    
    # Get or create a team member for author
    author, created = TeamMember.objects.get_or_create(
        name='Test Author',
        defaults={
            'role': 'Developer',
            'bio': 'Test author for blog posts',
            'is_active': True,
            'order': 1
        }
    )
    
    # Create test posts with different statuses
    test_posts = [
        {
            'title': 'Test Published Post',
            'slug': 'test-published-post',
            'summary': 'This is a test published post for frontend testing.',
            'body': 'This is the body of a test published post. It should appear in the frontend.',
            'status': 'published',
            'published_at': datetime.now() - timedelta(days=1),
            'is_featured': True,
            'category': 'technology',
            'tags': ['test', 'published', 'frontend'],
            'reading_time': 3
        },
        {
            'title': 'Test Draft Post',
            'slug': 'test-draft-post',
            'summary': 'This is a test draft post that should also be visible.',
            'body': 'This is the body of a test draft post. It should be visible in the frontend.',
            'status': 'draft',
            'published_at': None,
            'is_featured': False,
            'category': 'development',
            'tags': ['test', 'draft', 'frontend'],
            'reading_time': 5
        },
        {
            'title': 'Test Archived Post',
            'slug': 'test-archived-post',
            'summary': 'This is a test archived post for testing status filtering.',
            'body': 'This is the body of a test archived post.',
            'status': 'archived',
            'published_at': datetime.now() - timedelta(days=30),
            'is_featured': False,
            'category': 'business',
            'tags': ['test', 'archived', 'frontend'],
            'reading_time': 2
        }
    ]
    
    created_posts = []
    
    for post_data in test_posts:
        post, created = BlogPost.objects.get_or_create(
            slug=post_data['slug'],
            defaults={
                'title': post_data['title'],
                'summary': post_data['summary'],
                'body': post_data['body'],
                'status': post_data['status'],
                'published_at': post_data['published_at'],
                'is_featured': post_data['is_featured'],
                'category': post_data['category'],
                'tags': post_data['tags'],
                'reading_time': post_data['reading_time'],
                'author': author
            }
        )
        
        if created:
            print(f"✅ Created: {post.title} (Status: {post.status})")
            created_posts.append(post)
        else:
            print(f"ℹ️  Already exists: {post.title} (Status: {post.status})")
    
    print(f"\n🎉 Created {len(created_posts)} new test blog posts!")
    print("\nYou can now:")
    print("1. Check the frontend at /blog to see all posts")
    print("2. Use the status filters to see different post types")
    print("3. Test the category and tag filtering")
    
    return created_posts

if __name__ == '__main__':
    print("🚀 Creating test blog posts...")
    create_test_blog_posts()
