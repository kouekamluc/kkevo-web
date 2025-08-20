'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, ArrowLeft, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import { BlogPost } from '@/types';

export default function BlogSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await blogApi.search(searchQuery);
      const searchResults = response.data.results || response.data || [];
      
      setPosts(searchResults);
    } catch (error) {
      console.error('Error searching blog posts:', error);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
            <p className="text-white text-xl mt-4">Searching blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Search Header */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Search Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find the insights and tutorials you're looking for
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for articles, tutorials, insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </FadeInSection>

        {/* Search Results */}
        {query && (
          <FadeInSection>
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Search Results for "{query}"
                </h2>
                {posts.length > 0 && (
                  <p className="text-gray-400">
                    {posts.length} result{posts.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>

              {error ? (
                <div className="text-center py-16">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Search Error</h3>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <button
                    onClick={() => performSearch(query)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">No results found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search terms or browse all posts
                  </p>
                  <Link
                    href="/blog"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse All Posts
                  </Link>
                </div>
              ) : (
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
        )}

        {/* Popular Search Suggestions */}
        {!query && (
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-6">
                Popular Topics
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  'Web Development',
                  'Mobile Apps',
                  'AI & Machine Learning',
                  'DevOps',
                  'Business Strategy',
                  'UI/UX Design',
                  'Python',
                  'React',
                  'Django',
                  'Cloud Computing'
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setSearchTerm(topic);
                      router.push(`/blog/search?q=${encodeURIComponent(topic)}`);
                    }}
                    className="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
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

