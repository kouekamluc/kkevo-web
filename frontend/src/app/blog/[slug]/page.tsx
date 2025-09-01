'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Heart, Bookmark, Share2, Eye, Clock, User, Calendar, Tag, 
  ArrowLeft, MessageCircle, ThumbsUp, BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { blogApi } from '@/lib/api';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogComments from '@/components/blog/BlogComments';
import ReadingProgressTracker from '@/components/blog/ReadingProgressTracker';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  summary: string;
  body: string;
  featured_image?: string;
  hero_image?: string;
  author: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    picture?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  status: string;
  published_at: string;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  comment_count: number;
  difficulty_level: string;
  estimated_reading_time: number;
  is_featured: boolean;
  related_posts?: BlogPost[];
}

const BlogDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await blogApi.getBySlug(slug);
      const postData = response.data;
      
      setPost(postData);
      setLikeCount(postData.like_count);
      setBookmarkCount(postData.bookmark_count);
      
      // Check if user has already liked/bookmarked this post
      if (isAuthenticated && user) {
        // This would typically come from the API response
        // For now, we'll assume the user hasn't interacted
        setIsLiked(false);
        setIsBookmarked(false);
      }
      
      // Fetch related posts
      if (postData.related_posts && postData.related_posts.length > 0) {
        setRelatedPosts(postData.related_posts);
      } else {
        // Fetch posts from same category
        try {
          const relatedResponse = await blogApi.getCategoryPosts(postData.category.slug, {
            limit: 3,
            exclude: postData.id
          });
          setRelatedPosts(relatedResponse.data.slice(0, 3));
        } catch (error) {
          console.error('Error fetching related posts:', error);
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      setError(error.response?.data?.message || 'Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    if (!post) return;

    setIsLoading(true);
    try {
      const response = await blogApi.like(post.id);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.like_count);
      
      if (response.data.liked) {
        toast.success('Post liked!');
      } else {
        toast.success('Post unliked');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark posts');
      return;
    }

    if (!post) return;

    setIsLoading(true);
    try {
      const response = await blogApi.bookmark(post.id);
      setIsBookmarked(response.data.bookmarked);
      setBookmarkCount(response.data.bookmark_count);
      
      if (response.data.bookmarked) {
        toast.success('Post bookmarked!');
      } else {
        toast.success('Bookmark removed');
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast.error('Failed to bookmark post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    if (!post) return;

    try {
      await blogApi.share(post.id, {
        share_type: 'social',
        platform
      });
      
      // Handle actual sharing
      const url = `${window.location.origin}/blog/${post.slug}`;
      const text = `Check out this article: ${post.title}`;
      
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
          break;
        default:
          // Copy to clipboard
          await navigator.clipboard.writeText(`${text}\n${url}`);
          toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
    }
  };

  const handleCommentAction = (action: string, commentId: number) => {
    // Update comment count if comment was created/deleted
    if (action === 'create' && post) {
      setPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : null);
    } else if (action === 'delete' && post) {
      setPost(prev => prev ? { ...prev, comment_count: Math.max(0, prev.comment_count - 1) } : null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return level;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/blog')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = post.hero_image || post.featured_image || '/images/blog-placeholder.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                >
                  {post.category.icon} {post.category.name}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(post.difficulty_level)}`}>
                  {getDifficultyText(post.difficulty_level)}
                </span>
                {post.is_featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt || post.summary}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.first_name || post.author.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.estimated_reading_time} min read</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{likeCount}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{bookmarkCount}</span>
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-2">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span className="w-4 h-4 bg-blue-400 rounded"></span>
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span className="w-4 h-4 bg-blue-600 rounded"></span>
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span className="w-4 h-4 bg-blue-700 rounded"></span>
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span className="w-4 h-4 bg-gray-400 rounded"></span>
                        <span>Copy Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reading Progress Tracker */}
            <div className="lg:col-span-1">
              <ReadingProgressTracker
                postId={post.id}
                postTitle={post.title}
                estimatedReadingTime={post.estimated_reading_time}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Featured Image */}
            {imageUrl && (
              <div className="mb-8">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Article Content */}
            <article className="prose prose-lg max-w-none mb-12">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </article>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Comments Section */}
            <div className="mb-12">
              <BlogComments
                postId={post.id}
                postSlug={post.slug}
                onCommentAction={handleCommentAction}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Article Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{post.view_count}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Likes</span>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{likeCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bookmarks</span>
                  <div className="flex items-center space-x-2">
                    <Bookmark className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{bookmarkCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments</span>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{post.comment_count}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-center space-x-3">
                {post.author.picture ? (
                  <img
                    src={post.author.picture}
                    alt={post.author.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {post.author.first_name || post.author.username}
                  </h4>
                  <p className="text-sm text-gray-600">Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  variant="default"
                  showActions={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
