'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, Star, Eye, Heart, BookOpen, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { BlogPost } from '@/types';

const popularTags = [
  'Web Development', 'Mobile Apps', 'AI & ML', 'DevOps', 'Cloud Computing',
  'React', 'Python', 'JavaScript', 'Django', 'Next.js', 'Business', 'Technology'
];

const categories = [
  { id: 'all', name: 'All Categories', color: 'bg-gray-500' },
  { id: 'technology', name: 'Technology', color: 'bg-blue-500' },
  { id: 'business', name: 'Business', color: 'bg-green-500' },
  { id: 'design', name: 'Design', color: 'bg-purple-500' },
  { id: 'development', name: 'Development', color: 'bg-orange-500' },
  { id: 'ai-ml', name: 'AI & ML', color: 'bg-red-500' },
  { id: 'devops', name: 'DevOps', color: 'bg-indigo-500' },
  { id: 'case-studies', name: 'Case Studies', color: 'bg-pink-500' },
  { id: 'industry-news', name: 'Industry News', color: 'bg-yellow-500' },
  { id: 'tutorials', name: 'Tutorials', color: 'bg-teal-500' },
  { id: 'best-practices', name: 'Best Practices', color: 'bg-cyan-500' }
];

const POSTS_PER_PAGE = 9;

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [allPostsResponse, featuredResponse] = await Promise.all([
          blogApi.getPublished({ page: 1, page_size: POSTS_PER_PAGE }),
          blogApi.getFeatured()
        ]);
        
        const allPosts = allPostsResponse.data.results || allPostsResponse.data || [];
        const featured = featuredResponse.data.results || featuredResponse.data || [];
        
        setPosts(allPosts);
        setFeaturedPosts(featured);
        setHasMore(allPosts.length === POSTS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex(prev => (prev + 1) % featuredPosts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  // Filter posts based on search, tags, and category
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => 
          post.tags?.some(postTag => 
            postTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    return filtered;
  }, [posts, searchTerm, selectedTags, selectedCategory]);

  // Load more posts
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await blogApi.getPublished({ 
        page: nextPage, 
        page_size: POSTS_PER_PAGE 
      });
      
      const newPosts = response.data.results || response.data || [];
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setCurrentPage(nextPage);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  // Carousel navigation
  const nextCarousel = () => setCurrentCarouselIndex(prev => (prev + 1) % featuredPosts.length);
  const prevCarousel = () => setCurrentCarouselIndex(prev => (prev - 1 + featuredPosts.length) % featuredPosts.length);

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
            <p className="text-white text-xl mt-4">Loading blog posts...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              KKEVO Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and industry knowledge from our team of experts. 
              Stay ahead with the latest in technology, business, and development.
            </p>
          </div>
        </FadeInSection>

        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <FadeInSection>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Featured Posts
              </h2>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCarouselIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      {featuredPosts[currentCarouselIndex] && (
                        <div className="relative h-96 md:h-[500px]">
                          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                          <img
                            src={featuredPosts[currentCarouselIndex].hero_image_url || '/api/placeholder/800/400'}
                            alt={featuredPosts[currentCarouselIndex].title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-end z-20 p-8">
                            <div className="text-white">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-yellow-500 text-black text-sm font-medium rounded-full">
                                  Featured
                                </span>
                                <span className="text-sm opacity-80">
                                  {formatDate(featuredPosts[currentCarouselIndex].published_at)}
                                </span>
                              </div>
                              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                                {featuredPosts[currentCarouselIndex].title}
                              </h3>
                              <p className="text-lg opacity-90 mb-4 max-w-2xl">
                                {featuredPosts[currentCarouselIndex].summary}
                              </p>
                              <Link
                                href={`/blog/${featuredPosts[currentCarouselIndex].slug}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                Read More
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Carousel Controls */}
                  {featuredPosts.length > 1 && (
                    <>
                      <button
                        onClick={prevCarousel}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextCarousel}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      
                      {/* Carousel Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {featuredPosts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentCarouselIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentCarouselIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Search and Filters */}
        <FadeInSection>
          <div className="mb-12">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters && <X className="w-4 h-4" />}
              </button>
              
              {(searchTerm || selectedTags.length > 0 || selectedCategory !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 border border-white/20 rounded-xl p-6 mb-6"
                >
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-white font-medium mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                              ? `${category.color} text-white`
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeInSection>

        {/* Blog Posts Grid */}
        <FadeInSection>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                {searchTerm || selectedTags.length > 0 || selectedCategory !== 'all' 
                  ? `Filtered Posts (${filteredPosts.length})`
                  : 'All Posts'
                }
              </h2>
              {filteredPosts.length > 0 && (
                <p className="text-gray-400">
                  Showing {filteredPosts.length} of {posts.length} posts
                </p>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-white mb-4">No posts found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <StaggerList>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
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
                            {post.hero_image ? (
                              <div className="h-48 rounded-t-xl overflow-hidden">
                                <img
                                  src={post.hero_image_url || `/api/placeholder/400/200`}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                            
                            {/* Category Badge */}
                            <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded">
                              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
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
                                {post.reading_time || getReadingTime(post.body)} min read
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                              {post.title}
                            </h3>

                            {/* Summary */}
                            <p className="text-gray-300 mb-4 line-clamp-3">
                              {post.summary}
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
                                  <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-8 h-8 rounded-full"
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
                                {post.views || 0}
                              </div>
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Heart className="w-4 h-4" />
                                {post.likes || 0}
                              </div>
                            </div>
                          </div>
                        </AnimatedCard>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </StaggerList>
            )}
          </div>
        </FadeInSection>

        {/* Load More Button */}
        {hasMore && filteredPosts.length === posts.length && (
          <FadeInSection>
            <div className="text-center">
              <AnimatedButton
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More Posts'
                )}
              </AnimatedButton>
            </div>
          </FadeInSection>
        )}

        {/* Newsletter Signup */}
        <FadeInSection>
          <div className="mt-20 text-center">
            <div className="bg-white/5 border border-white/20 rounded-2xl p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Get the latest insights, tutorials, and industry news delivered to your inbox. 
                No spam, just valuable content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
