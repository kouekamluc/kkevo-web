"""
Admin configuration for blog app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import BlogPost, BlogCategory, BlogPostView, BlogPostLike, BlogPostBookmark, BlogPostShare, BlogTag, BlogPostComment, UserReadingProgress, BlogPostAnalytics


class BlogPostAdminForm(forms.ModelForm):
    """Custom form for BlogPost admin to handle JSONField properly."""
    
    class Meta:
        model = BlogPost
        fields = '__all__'
    
    def clean_tags(self):
        """Ensure tags field is always a valid JSON list."""
        tags = self.cleaned_data.get('tags')
        
        # If tags is empty string or None, return empty list
        if not tags or tags == '':
            return []
        
        # If tags is already a list, return as is
        if isinstance(tags, list):
            return tags
        
        # If tags is a string, try to parse it as comma-separated values
        if isinstance(tags, str):
            # Split by comma and clean up
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
            return tag_list
        
        # Fallback to empty list
        return []


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """Admin configuration for BlogCategory model."""
    
    list_display = ['name', 'slug', 'color', 'order', 'is_active', 'post_count']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['order', 'is_active', 'color']
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'color', 'order', 'is_active')
        }),
    )
    
    def post_count(self, obj):
        """Display count of posts in this category."""
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPost model."""
    
    form = BlogPostAdminForm
    
    list_display = [
        'title', 'author', 'category_display', 'status', 'is_featured', 'order', 'featured_image_preview', 
        'view_count', 'like_count', 'created_at'
    ]
    list_filter = ['status', 'is_featured', 'new_category', 'created_at', 'author']
    search_fields = ['title', 'excerpt', 'body', 'author__name', 'tags']
    list_editable = ['status', 'is_featured', 'order']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'view_count', 'like_count', 
        'bookmark_count', 'share_count', 'comment_count', 'word_count', 'estimated_reading_time'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'excerpt', 'status', 'is_featured', 'order')
        }),
        ('Content', {
            'fields': ('body', 'featured_image')
        }),
        ('Author & Categorization', {
            'fields': ('author', 'new_category', 'category', 'tags')
        }),
        ('SEO & Metadata', {
            'fields': ('meta_title', 'meta_description')
        }),
        ('Publishing', {
            'fields': ('published_at',)
        }),
        ('Engagement Metrics', {
            'fields': ('view_count', 'like_count', 'bookmark_count', 'share_count', 'comment_count'),
            'classes': ('collapse',)
        }),
        ('Reading Metrics', {
            'fields': ('word_count', 'estimated_reading_time'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def category_display(self, obj):
        """Display category information in admin list."""
        if obj.new_category:
            return f"{obj.new_category.name} (new)"
        elif obj.category:
            return f"{obj.category} (legacy)"
        return "No category"
    
    category_display.short_description = 'Category'
    
    def featured_image_preview(self, obj):
        """Display featured image preview in admin list."""
        if obj.featured_image:
            # featured_image is a CharField, so we can use it directly as the URL
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 50px;" />',
                obj.featured_image
            )
        return "No image"
    
    featured_image_preview.short_description = 'Featured Image'
    
    def get_queryset(self, request):
        """Optimize queryset for admin."""
        return super().get_queryset(request).select_related('author', 'new_category')
    
    def save_model(self, request, obj, form, change):
        """Auto-set published_at when status changes to published."""
        if obj.status == 'published' and not obj.published_at:
            from django.utils import timezone
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(BlogPostView)
class BlogPostViewAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPostView model."""
    
    list_display = ['post', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at', 'post']
    search_fields = ['post__title', 'ip_address']
    readonly_fields = ['viewed_at']
    
    fieldsets = (
        ('View Information', {
            'fields': ('post', 'ip_address', 'user_agent', 'referrer')
        }),
        ('Timestamps', {
            'fields': ('viewed_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPostLike)
class BlogPostLikeAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPostLike model."""
    
    list_display = ['post', 'ip_address', 'liked_at']
    list_filter = ['liked_at', 'post']
    search_fields = ['post__title', 'ip_address']
    readonly_fields = ['liked_at']
    
    fieldsets = (
        ('Like Information', {
            'fields': ('post', 'ip_address')
        }),
        ('Timestamps', {
            'fields': ('liked_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPostBookmark)
class BlogPostBookmarkAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPostBookmark model."""
    
    list_display = ['post', 'ip_address', 'bookmarked_at']
    list_filter = ['bookmarked_at', 'post']
    search_fields = ['post__title', 'ip_address']
    readonly_fields = ['bookmarked_at']
    
    fieldsets = (
        ('Bookmark Information', {
            'fields': ('post', 'ip_address')
        }),
        ('Timestamps', {
            'fields': ('bookmarked_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPostShare)
class BlogPostShareAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPostShare model."""
    
    list_display = ['post', 'platform', 'ip_address', 'shared_at']
    list_filter = ['platform', 'shared_at', 'post']
    search_fields = ['post__title', 'ip_address', 'platform']
    readonly_fields = ['shared_at']
    
    fieldsets = (
        ('Share Information', {
            'fields': ('post', 'platform', 'ip_address')
        }),
        ('Timestamps', {
            'fields': ('shared_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    """Admin configuration for BlogTag model."""
    
    list_display = ['name', 'slug', 'color', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug']
    list_editable = ['color']
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Tag Information', {
            'fields': ('name', 'slug', 'color')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPostComment)
class BlogPostCommentAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPostComment model."""
    
    list_display = ['post', 'user', 'parent', 'is_approved', 'is_moderated', 'created_at']
    list_filter = ['is_approved', 'is_moderated', 'created_at', 'post']
    search_fields = ['content', 'post__title', 'user__username']
    list_editable = ['is_approved', 'is_moderated']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Comment Information', {
            'fields': ('post', 'user', 'parent', 'content')
        }),
        ('Moderation', {
            'fields': ('is_approved', 'is_moderated', 'moderated_at', 'moderation_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserReadingProgress)
class UserReadingProgressAdmin(admin.ModelAdmin):
    """Admin configuration for UserReadingProgress model."""
    
    list_display = ['user', 'post', 'progress_percentage', 'is_completed', 'last_read_at']
    list_filter = ['is_completed', 'last_read_at', 'post']
    search_fields = ['user__username', 'post__title']
    readonly_fields = ['created_at', 'last_read_at']
    
    fieldsets = (
        ('Progress Information', {
            'fields': ('user', 'post', 'progress_percentage', 'time_spent', 'last_position', 'is_completed')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at', 'last_read_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPostAnalytics)
class BlogPostAnalyticsAdmin(admin.ModelAdmin):
    """Admin configuration for BlogPostAnalytics model."""
    
    list_display = ['post', 'unique_views', 'bounce_rate', 'completion_rate', 'updated_at']
    list_filter = ['updated_at']
    search_fields = ['post__title']
    readonly_fields = ['updated_at']
    
    fieldsets = (
        ('Engagement Metrics', {
            'fields': ('unique_views', 'returning_visitors', 'bounce_rate')
        }),
        ('Reading Behavior', {
            'fields': ('average_time_on_page', 'average_scroll_depth', 'completion_rate')
        }),
        ('Social Metrics', {
            'fields': ('social_shares', 'social_clicks')
        }),
        ('SEO Metrics', {
            'fields': ('search_impressions', 'search_clicks', 'ctr')
        }),
        ('Conversion Metrics', {
            'fields': ('lead_generations', 'newsletter_signups')
        }),
        ('Timestamps', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
