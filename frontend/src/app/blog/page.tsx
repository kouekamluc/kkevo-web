'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useDebounce } from '@/hooks';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  hero_image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  status: string;
  published_at: string;
  is_featured: boolean;
  reading_time: number;
}

const popularTags = [
  'Web Development', 'Mobile Apps', 'AI & ML', 'DevOps', 'Cloud Computing',
  'React', 'Python', 'JavaScript', 'Django', 'Next.js'
];



export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogApi.getAll({ page: currentPage });
        const newPosts = response.data.results || response.data;
        
        if (currentPage === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        setHasMore(newPosts.length > 0);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (debouncedSearchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }

    setFilteredPosts(filtered);
  }, [debouncedSearchTerm, selectedTags, posts]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Blog & Insights
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Stay updated with the latest trends in software development, technology insights, 
                  and industry best practices from our team of experts.
                </p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No articles found.
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            ) : (
              <StaggerList>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      className="group cursor-pointer"
                      onClick={() => window.location.href = `/blog/${post.slug}`}
                    >
                      <AnimatedCard className="h-full group-hover:scale-105 transition-transform duration-300">
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 group-hover:brightness-75 transition-all duration-300"></div>
                          {post.is_featured && (
                            <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                              Featured
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(post.published_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.reading_time} min read
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {post.summary}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {post.author.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {post.author.role}
                                </p>
                              </div>
                            </div>
                            
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        </div>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </div>
              </StaggerList>
            )}

            {/* Load More Button */}
            {hasMore && filteredPosts.length > 0 && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? 'Loading...' : 'Load More Articles'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Get the latest insights and updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </FadeInSection>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
