# Blog Post Creation Guide

This guide explains how to create and manage blog posts in the KKEVO application.

## Method 1: Django Admin Interface (Recommended for Content Creators)

### 1. Access the Admin Panel
- Navigate to `http://localhost:8000/admin/`
- Log in with your admin credentials
- Click on "Blog posts" under the "Blog" section

### 2. Create a New Blog Post
- Click "Add blog post" button
- Fill in the required fields:
  - **Title**: The main title of your blog post
  - **Slug**: URL-friendly version of the title (auto-generated)
  - **Excerpt**: Short summary for previews
  - **Body**: Main content of the blog post (supports markdown)
  - **Author**: Select from existing team members
  - **Category**: Choose from available categories
  - **Tags**: Add relevant tags as a JSON array
  - **Status**: Draft, Published, or Archived
  - **Featured Image**: URL or path to the hero image
  - **Meta Title/Description**: For SEO purposes

### 3. Publish the Post
- Set status to "Published"
- Set "Published at" date to current time
- Click "Save" to publish

## Method 2: Management Command (For Developers)

### 1. Create Sample Posts
```bash
cd backend
python manage.py create_sample_blog_post --count 5
```

### 2. Create Custom Posts
```bash
python manage.py shell
```

```python
from blog.models import BlogPost, BlogCategory
from team.models import TeamMember
from django.utils import timezone
import uuid

# Get or create author
author, _ = TeamMember.objects.get_or_create(
    name='Your Name',
    defaults={'role': 'Developer'}
)

# Get or create category
category, _ = BlogCategory.objects.get_or_create(
    slug='your-category',
    defaults={'name': 'Your Category', 'color': 'bg-blue-500'}
)

# Create blog post
post = BlogPost.objects.create(
    id=str(uuid.uuid4()),
    title='Your Blog Post Title',
    slug='your-blog-post-slug',
    excerpt='Brief description of your post',
    body='''
# Your Content Here

This is the main content of your blog post. You can use markdown formatting.

## Subheadings
- Bullet points
- **Bold text**
- *Italic text*

```python
# Code blocks
print("Hello, World!")
```
    ''',
    author=author,
    new_category=category,
    category='your-category',
    tags=['tag1', 'tag2', 'tag3'],
    status='published',
    published_at=timezone.now(),
    is_featured=False
)
```

## Method 3: API Endpoints (For Developers)

### 1. Create Post via API
```bash
curl -X POST http://localhost:8000/api/v1/blog/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Created Post",
    "slug": "api-created-post",
    "excerpt": "Post created via API",
    "body": "Content here...",
    "category": "web-development",
    "tags": ["api", "django"],
    "status": "published",
    "is_featured": false
  }'
```

### 2. Update Post
```bash
curl -X PATCH http://localhost:8000/api/v1/blog/api-created-post/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "excerpt": "Updated excerpt"
  }'
```

## Image Management

### 1. Upload Images
- Use the image upload endpoint: `POST /api/v1/blog/upload_image/`
- Images are stored in the media directory
- Reference images in your blog post body using the returned URL

### 2. Featured Images
- Set the `featured_image` field to the image URL
- Images will be displayed in blog previews and detail pages

## Content Formatting

### 1. Markdown Support
The blog post body supports markdown formatting:

```markdown
# Main Heading
## Subheading
### Sub-subheading

**Bold text**
*Italic text*
`inline code`

- Bullet point 1
- Bullet point 2

1. Numbered list
2. Second item

[Link text](https://example.com)

![Alt text](image-url)

```python
# Code block
def hello():
    print("Hello, World!")
```
```

### 2. HTML Support
You can also use HTML tags for more complex formatting.

## SEO Optimization

### 1. Meta Fields
- **Meta Title**: Keep under 60 characters
- **Meta Description**: Keep under 160 characters
- **Slug**: Use descriptive, URL-friendly text

### 2. Tags and Categories
- Use relevant tags to improve discoverability
- Categorize posts appropriately
- Tags help with internal linking and search

## Publishing Workflow

### 1. Draft → Review → Publish
1. Create post with "Draft" status
2. Review and edit content
3. Set status to "Published"
4. Set publication date

### 2. Scheduling Posts
- Set future publication dates for scheduled posts
- Posts will automatically become visible when the date arrives

## Engagement Tracking

### 1. View Counts
- Views are automatically tracked when posts are accessed
- No manual intervention required

### 2. Likes and Bookmarks
- Users can like/unlike posts
- Bookmark functionality for saving posts
- All engagement metrics are displayed in the admin

## Troubleshooting

### 1. Images Not Displaying
- Check if image URLs are correct
- Ensure images are accessible
- Verify media settings in Django

### 2. Posts Not Showing
- Check if status is set to "Published"
- Verify publication date is not in the future
- Check if post is filtered out by category or tags

### 3. Admin Access Issues
- Ensure user has staff permissions
- Check if user is assigned to blog permissions group

## Best Practices

1. **Content Quality**: Write engaging, informative content
2. **Regular Updates**: Maintain consistent posting schedule
3. **SEO Optimization**: Use proper meta descriptions and tags
4. **Image Optimization**: Use appropriately sized images
5. **Mobile Responsiveness**: Ensure content looks good on all devices
6. **Internal Linking**: Link to related posts and pages
7. **Analytics**: Monitor view counts and engagement metrics

## Support

For technical issues or questions about blog functionality, contact the development team or check the Django admin logs for error messages.






