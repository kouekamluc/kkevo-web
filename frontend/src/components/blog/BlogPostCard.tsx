'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, Eye, Clock, User, Calendar, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { blogApi } from '@/lib/api';
import toast from 'react-hot-toast';

import { BlogPost } from '@/types';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  showActions?: boolean;
  onAction?: (action: string, postId: string) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'default',
  showActions = true,
  onAction
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmark_count);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already liked/bookmarked this post
  useEffect(() => {
    if (isAuthenticated && user) {
      // This would typically come from the API response
      // For now, we'll assume the user hasn't interacted
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [isAuthenticated, user, post.slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    setIsLoading(true);
    try {
      const response = await blogApi.like(post.slug, isLiked ? 'unlike' : 'like');
      setIsLiked(!isLiked);
      setLikeCount(response.data.like_count);
      
      if (!isLiked) {
        toast.success('Post liked!');
      } else {
        toast.success('Post unliked');
      }
      
      onAction?.('like', post.slug);
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

    setIsLoading(true);
    try {
      const response = await blogApi.bookmark(post.slug, isBookmarked ? 'unbookmark' : 'bookmark');
      setIsBookmarked(!isBookmarked);
      setBookmarkCount(response.data.bookmark_count);
      
      if (!isBookmarked) {
        toast.success('Post bookmarked!');
      } else {
        toast.success('Bookmark removed');
      }
      
      onAction?.('bookmark', post.slug);
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast.error('Failed to bookmark post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      await blogApi.share(post.slug, {
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
      
      onAction?.('share', post.slug);
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
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

  const imageUrl = post.hero_image || post.featured_image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjAwSDQ1MFYyNTBIMzUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmxvZyBJbWFnZTwvdGV4dD4KPC9zdmc+';

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <Link href={`/blog/${post.slug}`} className="block p-4">
          <div className="flex items-center space-x-3">
            {imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {post.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{post.estimated_reading_time} min read</span>
                <span>•</span>
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="relative">
          {imageUrl && (
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              {post.is_featured && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              {post.category && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                >
                  {post.category.name}
                </span>
              )}
              {post.difficulty_level && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty_level)}`}>
                  {getDifficultyText(post.difficulty_level)}
                </span>
              )}
            </div>
            
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.excerpt || post.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.estimated_reading_time} min read</span>
                </div>
              </div>
              
              {showActions && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    disabled={isLoading}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    disabled={isLoading}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{bookmarkCount}</span>
                  </button>
                  
                  <div className="relative group">
                    <button className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
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
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="relative">
        {imageUrl && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            {post.is_featured && (
              <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </div>
            )}
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            {post.category && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
              >
                {post.category.name}
              </span>
            )}
            {post.difficulty_level && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty_level)}`}>
                {getDifficultyText(post.difficulty_level)}
              </span>
            )}
          </div>
          
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.excerpt || post.summary}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author.first_name || post.author.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.estimated_reading_time} min</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.view_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bookmark className="w-4 h-4" />
                <span>{bookmarkCount}</span>
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleBookmark}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <div className="relative group">
                  <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-2">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;


