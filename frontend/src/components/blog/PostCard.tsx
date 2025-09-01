'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedCard } from '@/components/ui';
import { BlogPost } from '@/types';
import { getSafeImageUrl, isValidAvatarUrl } from '@/lib/imageUtils';

interface PostCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  showAuthor?: boolean;
  showStats?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  variant = 'default',
  className = '',
  showAuthor = true,
  showStats = true
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Link href={`/blog/${post.slug}`}>
        <AnimatedCard className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group ${
          isFeatured ? 'ring-2 ring-yellow-400' : ''
        }`}>
          {/* Featured Badge */}
          {post.is_featured && (
            <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-black text-xs font-medium rounded z-10">
              Featured
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded z-10">
              {post.category.name ? 
                post.category.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                'Uncategorized'
              }
            </div>
          )}

          {/* Hero Image */}
          <div className="relative">
            {post.featured_image ? (
              <div className={`${isCompact ? 'h-32' : 'h-48'} rounded-t-xl overflow-hidden relative`}>
                <Image
                  src={getSafeImageUrl(post.featured_image, 400, isCompact ? 128 : 192)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className={`${isCompact ? 'h-32' : 'h-48'} bg-gradient-to-br from-indigo-500 to-violet-600 rounded-t-xl flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`p-6 ${isCompact ? 'p-4' : ''}`}>
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </div>
                              <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.estimated_reading_time || getReadingTime(post.body)} min read
                </div>
            </div>

            {/* Title */}
            <h3 className={`font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2 ${
              isCompact ? 'text-lg' : 'text-xl'
            }`}>
              {post.title}
            </h3>

            {/* Summary */}
            {!isCompact && (
              <p className="text-gray-300 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && !isCompact && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Author */}
            {showAuthor && post.author && !isCompact && (
              <div className="flex items-center gap-3 mb-4">
                {post.author.avatar && isValidAvatarUrl(post.author.avatar) ? (
                  <Image
                    src={getSafeImageUrl(post.author.avatar, 32, 32)}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">
                    {post.author.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {post.author.role}
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            {showStats && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Eye className="w-4 h-4" />
                  {post.view_count || 0}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Heart className="w-4 h-4" />
                  {post.like_count || 0}
                </div>
                {!isCompact && (
                  <div className="flex items-center gap-1 text-gray-400 text-sm ml-auto">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedCard>
      </Link>
    </motion.div>
  );
};

export default PostCard;
