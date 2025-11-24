 'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Heart, Bookmark, Share2, Eye, Clock, User, Calendar, Tag, 
  ArrowLeft, ArrowRight, MessageCircle, ThumbsUp, BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { blogApi } from '@/lib/api';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogComments from '@/components/blog/BlogComments';
import ReadingProgressTracker from '@/components/blog/ReadingProgressTracker';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import TableOfContents from '@/components/blog/TableOfContents';
import SocialShare from '@/components/blog/SocialShare';
import SEOHead from '@/components/blog/SEOHead';
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
    name: string;
    role: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    description: string;
    order: number;
    is_active: boolean;
  } | null;
  tags: string[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at: string;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  comment_count: number;
  difficulty_level: string;
  estimated_reading_time: number;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  word_count: number;
  share_count: number;
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
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Fetching blog post with slug:', slug);
      console.log('🔍 API base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1');
      
      const response = await blogApi.getBySlug(slug);
      console.log('✅ API response received:', response.status);
      
      const postData = response.data;
      console.log('✅ Post data:', postData?.title || 'No title');
      
      if (!postData) {
        throw new Error('No blog post data received');
      }
      
      setPost(postData);
      setLikeCount(postData.like_count || 0);
      setBookmarkCount(postData.bookmark_count || 0);
      
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
        if (postData.category && postData.category.slug && postData.category.slug !== 'default') {
          try {
            const relatedResponse = await blogApi.getCategoryPosts(postData.category.slug, {
              limit: 3,
              exclude: postData.id
            });
            setRelatedPosts(relatedResponse.data.slice(0, 3));
          } catch (error) {
            console.error('Error fetching related posts:', error);
            // Fallback: fetch recent posts instead
            try {
              const recentResponse = await blogApi.getAll({ limit: 4, exclude: postData.id });
              // Handle both paginated and non-paginated responses
              const posts = recentResponse.data.results || recentResponse.data;
              setRelatedPosts(Array.isArray(posts) ? posts.slice(0, 3) : []);
            } catch (fallbackError) {
              console.error('Error fetching fallback posts:', fallbackError);
            }
          }
        } else {
          // If no valid category, fetch recent posts instead
          try {
            const recentResponse = await blogApi.getAll({ limit: 4, exclude: postData.id });
            // Handle both paginated and non-paginated responses
            const posts = recentResponse.data.results || recentResponse.data;
            setRelatedPosts(Array.isArray(posts) ? posts.slice(0, 3) : []);
          } catch (error) {
            console.error('Error fetching fallback posts:', error);
          }
        }
      }
      
    } catch (error: any) {
      console.error('🚨 Error fetching blog post:', error);
      console.error('🚨 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail ||
                          error.message ||
                          'Failed to load blog post';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    if (!post) return;

    setIsLoading(true);
    try {
      const response = await blogApi.like(post.slug);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.like_count);
      
      if (response.data.liked) {
        toast.success('Post liked!');
      } else {
        toast.success('Post unliked');
      }
    } catch (error: any) {
      console.error('Error liking post:', error);
      if (error.response?.status === 403) {
        toast.error('Please login to like posts');
      } else {
        toast.error('Failed to like post');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to bookmark posts');
      return;
    }

    if (!post) return;

    setIsLoading(true);
    try {
      const response = await blogApi.bookmark(post.slug);
      setIsBookmarked(response.data.bookmarked);
      setBookmarkCount(response.data.bookmark_count);
      
      if (response.data.bookmarked) {
        toast.success('Post bookmarked!');
      } else {
        toast.success('Bookmark removed');
      }
    } catch (error: any) {
      console.error('Error bookmarking post:', error);
      if (error.response?.status === 403) {
        toast.error('Please login to bookmark posts');
      } else {
        toast.error('Failed to bookmark post');
      }
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

  const getDifficultyColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    
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

  const getDifficultyText = (level?: string) => {
    if (!level) return 'General';
    
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
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading blog post...</p>
          </div>
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
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-red-800">
                  <strong>Error details:</strong> {error}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Slug: {slug}
                </p>
              </div>
            )}
            <div className="space-x-4">
              <button
                onClick={() => router.push('/blog')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Blog
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = post.hero_image || post.featured_image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjAwSDQ1MFYyNTBIMzUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmxvZyBJbWFnZTwvdGV4dD4KPC9zdmc+';

  return (
    <>
      <SEOHead
        title={`${post.title} | KKEVO Blog`}
        description={post.excerpt || post.summary || ''}
        image={post.hero_image || post.featured_image}
        url={`/blog/${post.slug}`}
        author={post.author.name}
        publishedTime={post.published_at}
        modifiedTime={post.updated_at}
        tags={post.tags}
        type="article"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Blog</span>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                {post.category && (
                  <span
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: post.category.color }}></div>
                    {post.category.name}
                  </span>
                )}
                {post.difficulty_level && (
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 ${getDifficultyColor(post.difficulty_level)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${getDifficultyColor(post.difficulty_level).replace('bg-', 'bg-').replace('text-', 'bg-')}`}></div>
                    {getDifficultyText(post.difficulty_level)}
                  </span>
                )}
                {post.is_featured && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm transition-all duration-200 hover:scale-105">
                    <span className="mr-2">⭐</span>
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                {post.excerpt || post.summary}
              </p>
              
              <div className="flex items-center space-x-8 text-sm text-gray-600 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author.name || 'Unknown Author'}</p>
                    <p className="text-xs text-gray-500">{post.author.role || 'Author'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{formatDate(post.published_at)}</p>
                    <p className="text-xs text-gray-500">Published</p>
                  </div>
                </div>
                {post.estimated_reading_time && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.estimated_reading_time} min</p>
                      <p className="text-xs text-gray-500">Read time</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={handleLike}
                  disabled={isLoading}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isLiked 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                  <span className="text-sm">{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  disabled={isLoading}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isBookmarked 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{bookmarkCount}</span>
                  <span className="text-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                
                <SocialShare
                  url={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.excerpt || post.summary || ''}
                  variant="horizontal"
                />
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <TableOfContents content={post.body} />
          </div>
          
          <div className="lg:col-span-7">
            {/* Featured Image */}
            {imageUrl && (
              <div className="mb-8">
                <div className="aspect-video relative overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
            
            {/* Article Content */}
            <article className="bg-white rounded-xl p-8 shadow-sm mb-12">
              <MarkdownRenderer content={post.body} />
            </article>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span>Related Topics</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-sm"
                    >
                      #{tag}
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
          <div className="lg:col-span-3">
            {/* Article Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span>Article Stats</span>
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Views</span>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-gray-900">{post.view_count}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Likes</span>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-gray-900">{likeCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Bookmarks</span>
                  <div className="flex items-center space-x-2">
                    <Bookmark className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-gray-900">{bookmarkCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Comments</span>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-gray-900">{post.comment_count}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span>About the Author</span>
              </h3>
              <div className="text-center">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-100 shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {post.author.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{post.author.role}</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Continue Reading
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover more insights and stories that might interest you
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="group">
                  <BlogPostCard
                    post={relatedPost}
                    variant="default"
                    showActions={false}
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => router.push('/blog')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Explore All Articles</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default BlogDetailPage;
