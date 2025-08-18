'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { blogApi } from '@/lib/api';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { BlogPost } from '@/types';

interface BlogPreviewProps {
  blogPosts?: BlogPost[];
}

const BlogPreview = ({ blogPosts = [] }: BlogPreviewProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback blog posts if no live data
  const fallbackPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Web Development in 2024',
      summary: 'Exploring the latest trends and technologies shaping the future of web development.',
      body: 'Web development continues to evolve rapidly...',
      slug: 'future-web-development-2024',
      tags: ['Web Development', 'React', 'Next.js', 'Trends'],
      status: 'published',
      is_featured: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 5,
      published_at: '2024-01-01T00:00:00Z',
      author: {
        id: '1',
        name: 'Alex Chen',
        role: 'Lead Developer',
        avatar: '/api/placeholder/100/100'
      }
    },
    {
      id: '2',
      title: 'Building Scalable Microservices Architecture',
      summary: 'Learn how to design and implement scalable microservices using modern technologies.',
      body: 'Microservices architecture has become the standard...',
      slug: 'scalable-microservices-architecture',
      tags: ['Microservices', 'Docker', 'Kubernetes', 'Architecture'],
      status: 'published',
      is_featured: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 8,
      published_at: '2024-01-01T00:00:00Z',
      author: {
        id: '2',
        name: 'Sarah Johnson',
        role: 'DevOps Engineer',
        avatar: '/api/placeholder/100/100'
      }
    },
    {
      id: '3',
      title: 'AI-Powered Testing: The Future of QA',
      summary: 'Discover how artificial intelligence is revolutionizing software testing processes.',
      body: 'Quality assurance is undergoing a transformation...',
      slug: 'ai-powered-testing-future-qa',
      tags: ['AI', 'Testing', 'QA', 'Automation'],
      status: 'published',
      is_featured: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 6,
      published_at: '2024-01-01T00:00:00Z',
      author: {
        id: '3',
        name: 'Marcus Rodriguez',
        role: 'QA Engineer',
        avatar: '/api/placeholder/100/100'
      }
    }
  ];

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogApi.getAll({ limit: 3, ordering: '-published_at' });
        const livePosts = response.data.results || response.data;
        setPosts(livePosts.length > 0 ? livePosts : fallbackPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts(fallbackPosts);
      } finally {
        setIsLoading(false);
      }
    };

    if (blogPosts.length > 0) {
      setPosts(blogPosts);
      setIsLoading(false);
    } else {
      fetchPosts();
    }
  }, [blogPosts]);

  // Use live posts if available, otherwise fallback
  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to safely get author name and role
  const getAuthorInfo = (author: BlogPost['author']) => {
    if (typeof author === 'string') {
      return { name: author, role: 'Author' };
    }
    return { name: author.name, role: author.role };
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-6 max-w-2xl mx-auto"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg max-w-xl mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Latest Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Stay updated with the latest trends in software development, technology insights, 
            and industry best practices from our team of experts.
          </motion.p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post, index) => (
                         <Link href={`/blog/${post.slug}`} key={post.id}>
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 className="group cursor-pointer"
               >
              <AnimatedCard className="h-full hover:shadow-xl transition-shadow duration-300">
                {/* Hero Image */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-48 rounded-t-xl flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white opacity-80" />
                  </div>
                  
                  {/* Featured Badge */}
                  {post.is_featured && (
                    <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                      Featured
                    </div>
                  )}
                  
                  {/* Reading Time */}
                  <div className="absolute top-4 right-4 px-2 py-1 bg-black/20 backdrop-blur-sm text-white text-xs rounded">
                    {post.reading_time} min read
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
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
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Summary */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.summary}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                        +{post.tags.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getAuthorInfo(post.author).name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getAuthorInfo(post.author).role}
                        </p>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
                               </AnimatedCard>
               </motion.div>
               </Link>
             ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/blog" className="inline-block">
            <AnimatedButton
              variant="primary"
              size="lg"
            >
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;
