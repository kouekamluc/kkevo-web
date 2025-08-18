'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check,
  ArrowLeft,
  BookOpen,
  Eye,
  Heart
} from 'lucide-react';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BlogPost } from '@/types';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  hero_image: string;
  author: {
    name: string;
    role: string;
  };
  published_at: string;
  reading_time: number;
}

const relatedPosts: RelatedPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development: What to Expect in 2024',
    slug: 'future-web-development-2024',
    summary: 'Explore the latest trends and technologies that will shape web development in the coming year.',
    hero_image: '/api/placeholder/400/200',
    author: { name: 'Sarah Johnson', role: 'CTO' },
    published_at: '2024-01-15',
    reading_time: 8
  },
  {
    id: '2',
    title: 'Building Scalable Microservices with Docker and Kubernetes',
    slug: 'scalable-microservices-docker-kubernetes',
    summary: 'Learn how to design and implement scalable microservices architecture using modern container technologies.',
    hero_image: '/api/placeholder/400/200',
    author: { name: 'David Kim', role: 'DevOps Engineer' },
    published_at: '2024-01-10',
    reading_time: 12
  },
  {
    id: '3',
    title: 'AI-Powered Testing: Automating Quality Assurance',
    slug: 'ai-powered-testing-automation',
    summary: 'Discover how artificial intelligence is revolutionizing software testing and quality assurance processes.',
    hero_image: '/api/placeholder/400/200',
    author: { name: 'Emily Watson', role: 'QA Engineer' },
    published_at: '2024-01-05',
    reading_time: 10
  }
];

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Reading progress bar
  const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogApi.getBySlug(params.slug as string);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Blog post not found');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  // GSAP animations for content elements
  useEffect(() => {
    if (!contentRef.current || !post) return;

    const tl = gsap.timeline({ scrollTrigger: { trigger: contentRef.current, start: 'top center' } });
    
    tl.fromTo('.blog-content h2', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    )
    .fromTo('.blog-content p', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }
    )
    .fromTo('.blog-content ul, .blog-content ol', 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 }
    );

    return () => {
      tl.kill();
    };
  }, [post]);

  const handleShare = async (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = post?.title || '';
    const text = post?.summary || '';

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
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        break;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full border-2 border-indigo-200 dark:border-indigo-800"></div>
            <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full border-2 border-violet-200 dark:border-violet-800"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not published'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.reading_time} min read
                  </div>
                  {post.is_featured && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Featured
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  {post.summary}
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {post.author.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {post.author.role}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    onClick={handleLike}
                    className="group"
                  >
                    <Heart className={`w-5 h-5 mr-2 transition-colors ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'} ({likeCount})
                  </AnimatedButton>
                  
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    onClick={() => handleShare('copy')}
                  >
                    {isCopied ? <Check className="w-5 h-5 mr-2" /> : <Share2 className="w-5 h-5 mr-2" />}
                    {isCopied ? 'Copied!' : 'Share'}
                  </AnimatedButton>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div ref={contentRef} className="blog-content prose prose-lg dark:prose-invert max-w-none">
                  {/* Hero Image */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-64 md:h-96 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-white opacity-80" />
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {post.body}
                    </p>
                    
                    {/* Sample content for demonstration */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">
                      Introduction to Modern Web Development
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      In today's rapidly evolving digital landscape, web development has become more complex and sophisticated than ever before. 
                      Developers need to master a wide range of technologies, from frontend frameworks to backend services, 
                      while ensuring their applications are performant, accessible, and secure.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
                      Key Technologies and Frameworks
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>React and Next.js for frontend development</li>
                      <li>Node.js and Django for backend services</li>
                      <li>PostgreSQL and MongoDB for data storage</li>
                      <li>Docker and Kubernetes for deployment</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
                      Best Practices for Performance
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Performance optimization is crucial for modern web applications. This includes:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Code splitting and lazy loading</li>
                      <li>Image optimization and compression</li>
                      <li>Caching strategies and CDN usage</li>
                      <li>Database query optimization</li>
                    </ol>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">
                      The Future of Web Development
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      As we look toward the future, several trends are shaping the web development landscape:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <li>WebAssembly for near-native performance</li>
                      <li>Progressive Web Apps (PWAs) for mobile-first experiences</li>
                      <li>AI-powered development tools and automation</li>
                      <li>Edge computing and serverless architectures</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
                      Code Example: Modern React Component
                    </h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code>{`import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ModernComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Component content */}
    </motion.div>
  );
};

export default ModernComponent;`}</code>
                      </pre>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">
                      Conclusion
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      Modern web development requires a comprehensive understanding of both frontend and backend technologies, 
                      along with a focus on performance, accessibility, and user experience. By staying current with the latest 
                      trends and best practices, developers can create applications that not only meet today's requirements 
                      but are also prepared for future challenges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Share Section */}
                  <AnimatedCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Share this post
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </AnimatedCard>

                  {/* Author Info */}
                  <AnimatedCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      About the author
                    </h3>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                        {post.author.name.charAt(0)}
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        {post.author.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {post.author.role}
                      </div>
                    </div>
                  </AnimatedCard>

                  {/* Reading Stats */}
                  <AnimatedCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Reading stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Reading time</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{post.reading_time} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Published</span>
                                                 <span className="font-semibold text-gray-900 dark:text-white">
                           {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not published'}
                         </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Likes</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{likeCount}</span>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Posts
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Continue reading with these related articles
                </p>
              </div>
            </FadeInSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <AnimatedCard className="h-full">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-48 rounded-t-xl flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {relatedPost.summary}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{relatedPost.author.name}</span>
                        <span>{relatedPost.reading_time} min read</span>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to Blog CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Enjoyed this article?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Explore more insights and tutorials in our blog
              </p>
              <Link href="/blog" className="inline-block">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Blog
                </AnimatedButton>
              </Link>
            </FadeInSection>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
