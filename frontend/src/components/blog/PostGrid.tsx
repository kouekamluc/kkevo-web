'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types';
import PostCard from './PostCard';
import { StaggerList } from '@/components/animations';

interface PostGridProps {
  posts: BlogPost[];
  variant?: 'default' | 'featured' | 'compact';
  columns?: 1 | 2 | 3 | 4;
  showAuthor?: boolean;
  showStats?: boolean;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

const PostGrid: React.FC<PostGridProps> = ({
  posts,
  variant = 'default',
  columns = 3,
  showAuthor = true,
  showStats = true,
  className = '',
  emptyMessage = 'No posts found',
  loading = false
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-8 ${className}`}>
        {Array.from({ length: columns * 2 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 rounded-xl h-80"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-semibold text-white mb-4">No posts found</h3>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <StaggerList>
      <div className={`grid ${getGridCols()} gap-8 ${className}`}>
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            variant={variant}
            showAuthor={showAuthor}
            showStats={showStats}
          />
        ))}
      </div>
    </StaggerList>
  );
};

export default PostGrid;






