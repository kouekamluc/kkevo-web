"""
RSS Feed generation for blog posts.
"""
from django.contrib.syndication.views import Feed
from django.utils import timezone
from django.http import HttpResponse
from .models import BlogPost


class BlogPostFeed(Feed):
    """RSS feed for blog posts."""
    title = "KKEVO Blog"
    link = "/blog/"
    description = "Latest blog posts from KKEVO"
    
    def items(self):
        """Get published blog posts."""
        return BlogPost.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).order_by('-published_at')[:20]
    
    def item_title(self, item):
        """Get item title."""
        return item.title
    
    def item_description(self, item):
        """Get item description."""
        return item.excerpt or item.summary or (item.body[:200] + "..." if item.body else "")
    
    def item_link(self, item):
        """Get item link."""
        return f"/blog/{item.slug}/"
    
    def item_pubdate(self, item):
        """Get item publication date."""
        return item.published_at
    
    def item_author_name(self, item):
        """Get item author name."""
        return item.author.name if item.author else "KKEVO Team"
    
    def item_categories(self, item):
        """Get item categories."""
        categories = []
        if item.new_category:
            categories.append(item.new_category.name)
        if item.tags:
            categories.extend(item.tags)
        return categories

