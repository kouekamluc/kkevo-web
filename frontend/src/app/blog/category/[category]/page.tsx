'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import { BlogPost } from '@/types';

interface BlogCategoryPageProps {
  params: { category: string };
}

const categoryNames: Record<string, string> = {
  'technology': 'Technology',
  'business': 'Business',
  'design': 'Design',
  'development': 'Development',
  'ai-ml': 'AI & Machine Learning',
  'devops': 'DevOps',
  'case-studies': 'Case Studies',
  'industry-news': 'Industry News',
  'tutorials': 'Tutorials',
  'best-practices': 'Best Practices'
};

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await blogApi.getByCategory(params.category);
        const categoryPosts = response.data.results || response.data || [];
        
        setPosts(categoryPosts);
      } catch (error) {
        console.error('Error fetching category posts:', error);
        setError('Failed to load category posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.category) {
      fetchCategoryPosts();
    }
  }, [params.category]);

  // Utility functions
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="text-white text-xl mt-4">Loading category posts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = categoryNames[params.category] || params.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <FadeInSection>
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </FadeInSection>

        {/* Category Header */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              {categoryName}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our latest insights and articles about {categoryName.toLowerCase()}
            </p>
            <div className="mt-6">
              <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-lg">
                {posts.length} post{posts.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </FadeInSection>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <FadeInSection>
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-white mb-4">No posts found</h3>
              <p className="text-gray-400 mb-6">
                No blog posts found in the {categoryName.toLowerCase()} category.
              </p>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
          </FadeInSection>
        ) : (
          <FadeInSection>
            <StaggerList>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <AnimatedCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                        {/* Hero Image */}
                        <div className="relative">
                          {post.featured_image ? (
                            <div className="h-48 rounded-t-xl overflow-hidden relative">
                              <Image
                                src={post.featured_image || `/api/placeholder/400/200`}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-48 rounded-t-xl flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="text-4xl mb-2">📝</div>
                                <div className="text-sm">No Image</div>
                              </div>
                            </div>
                          )}
                          
                          {/* Featured Badge */}
                          {post.is_featured && (
                            <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-black text-xs font-medium rounded">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
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
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Summary */}
                          <p className="text-gray-300 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
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
                          {post.author && (
                            <div className="flex items-center gap-3">
                              {post.author.avatar ? (
                                <Image
                                  src={post.author.avatar}
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
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                              <Eye className="w-4 h-4" />
                              {post.view_count || 0}
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                              <Heart className="w-4 h-4" />
                              {post.like_count || 0}
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </StaggerList>
          </FadeInSection>
        )}

        {/* Back to All Posts */}
        <FadeInSection>
          <div className="text-center mt-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Blog Posts
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}


