'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Heart, ArrowLeft, Mail, Linkedin, Twitter, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { blogApi, teamApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import { BlogPost, TeamMember } from '@/types';

interface BlogAuthorPageProps {
  params: { id: string };
}

export default function BlogAuthorPage({ params }: BlogAuthorPageProps) {
  const router = useRouter();
  const [author, setAuthor] = useState<TeamMember | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [authorResponse, postsResponse] = await Promise.all([
          teamApi.getById(params.id),
          blogApi.getAll({ author: params.id })
        ]);
        
        if (authorResponse.data) {
          setAuthor(authorResponse.data);
        }
        
        const authorPosts = postsResponse.data.results || postsResponse.data || [];
        setPosts(authorPosts);
      } catch (error) {
        console.error('Error fetching author data:', error);
        setError('Failed to load author information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAuthorData();
    }
  }, [params.id]);

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

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'ceo': 'CEO & Founder',
      'cto': 'CTO',
      'developer': 'Lead Developer',
      'designer': 'UI/UX Designer',
      'devops': 'DevOps Engineer',
      'pm': 'Product Manager',
      'qa': 'QA Engineer',
      'intern': 'Intern'
    };
    return roleMap[role] || role.replace(/\b\w/g, l => l.toUpperCase());
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="text-white text-xl mt-4">Loading author information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !author) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {error || 'Author not found'}
            </h1>
            <p className="text-gray-300 mb-8">
              The author you're looking for doesn't exist or couldn't be loaded.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
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

        {/* Author Header */}
        <FadeInSection>
          <div className="text-center mb-16">
            <div className="mb-8">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20"
                />
              ) : (
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/20">
                  <span className="text-white text-4xl font-medium">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <h1 className="text-5xl font-bold text-white mb-4">
                {author.name}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {getRoleDisplayName(author.role)}
              </p>
              
              {author.bio && (
                <p className="text-gray-400 max-w-3xl mx-auto mb-6">
                  {author.bio}
                </p>
              )}
              
              {/* Social Links */}
              <div className="flex items-center justify-center gap-4">
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="p-3 bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {author.twitter_url && (
                  <a
                    href={author.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {author.website_url && (
                  <a
                    href={author.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Website"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {posts.length}
                  </div>
                  <div className="text-gray-400">
                    Blog Post{posts.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {posts.reduce((total, post) => total + (post.views || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400">
                    Total Views
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Author's Blog Posts */}
        <FadeInSection>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Posts by {author.name}
              </h2>
              {posts.length > 0 && (
                <p className="text-gray-400">
                  {posts.length} post{posts.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-white mb-4">No posts yet</h3>
                <p className="text-gray-400 mb-6">
                  {author.name} hasn't published any blog posts yet.
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

