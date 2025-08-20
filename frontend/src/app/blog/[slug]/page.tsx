'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, User, Tag, Share2, Heart, Bookmark, 
  ArrowLeft, ArrowRight, Eye, MessageCircle, Twitter, 
  Facebook, Linkedin, Copy, Check, ExternalLink, Star, BookOpen,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard, AnimatedButton, KkevoLogo } from '@/components/ui';
import { BlogPost } from '@/types';

interface BlogDetailPageProps {
  params: { slug: string };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [postResponse, relatedResponse] = await Promise.all([
          blogApi.getBySlug(params.slug),
          blogApi.getByCategory('') // Will be updated with actual category
        ]);
        
        if (postResponse.data) {
          const postData = postResponse.data;
          setPost(postData);
          setLikeCount(postData.likes || 0);
          
          // Fetch related posts based on category and tags
          if (postData.category || postData.tags?.length > 0) {
            try {
              const relatedQuery = postData.category || postData.tags[0];
              const relatedResponse = await blogApi.getByCategory(relatedQuery);
              const related = relatedResponse.data.results || relatedResponse.data || [];
              
              // Filter out current post and limit to 3
              const filtered = related
                .filter((p: BlogPost) => p.slug !== params.slug)
                .slice(0, 3);
              
              setRelatedPosts(filtered);
            } catch (error) {
              console.warn('Could not fetch related posts:', error);
            }
          }
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Handle share
  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = `${window.location.origin}/blog/${post.slug}`;
    const title = post.title;
    const text = post.summary;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
    setShowShareMenu(false);
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
      <div className="min-h-screen bg-theme-secondary">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-accent mx-auto"></div>
            <p className="text-theme-primary text-xl mt-4">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-theme-secondary">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-theme-primary mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="text-theme-secondary mb-8">
              The blog post you're looking for doesn't exist or couldn't be loaded.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-theme-secondary text-theme-primary font-medium rounded-lg hover:bg-theme-tertiary transition-colors"
              >
                Go Back
              </button>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-theme-accent text-white font-medium rounded-lg hover:bg-theme-accent/80 transition-colors"
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
    <div className="min-h-screen bg-theme-secondary">
      <div className="container mx-auto px-4 py-16">
        {/* Company Logo */}
        <FadeInSection>
          <div className="text-center mb-12">
            <KkevoLogo
              width={120}
              height={40}
              variant="default"
              className="drop-shadow-lg mx-auto"
            />
          </div>
        </FadeInSection>

        {/* Back Button */}
        <FadeInSection>
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-theme-secondary hover:text-theme-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </FadeInSection>

        {/* Hero Section */}
        <FadeInSection>
          <div className="mb-12">
            {/* Hero Image */}
            {post.hero_image && (
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.hero_image_url || `/api/placeholder/800/400`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Featured Badge */}
                {post.is_featured && (
                  <div className="absolute top-6 left-6 px-3 py-2 bg-yellow-500 text-black text-sm font-medium rounded-full">
                    <Star className="w-4 h-4 inline mr-1" />
                    Featured
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-6 right-6 px-3 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            )}

            {/* Post Header */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-6 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-theme-secondary mb-8 max-w-3xl mx-auto">
                  {post.summary}
                </p>
              </div>

              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-6 bg-theme-card border border-theme-border-primary rounded-xl">
                <div className="flex items-center gap-6 text-theme-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.reading_time || getReadingTime(post.body)} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.views || 0} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-theme-secondary text-theme-primary hover:bg-theme-tertiary'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {likeCount}
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-theme-secondary text-theme-primary hover:bg-theme-tertiary'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 z-50"
                        >
                          <button
                            onClick={() => handleShare('twitter')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare('facebook')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Facebook className="w-4 h-4" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </button>
                          <button
                            onClick={() => handleShare('copy')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Author Information */}
              {post.author && (
                <div className="flex items-center gap-4 p-6 bg-theme-card border border-theme-border-primary rounded-xl mb-8">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-medium">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-theme-primary mb-1">
                      {post.author.name}
                    </h3>
                    <p className="text-theme-secondary mb-2">
                      {post.author.role}
                    </p>
                    <p className="text-theme-tertiary text-sm">
                      Published on {formatDate(post.published_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeInSection>

        {/* Blog Content */}
        <FadeInSection>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-theme-secondary leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </div>
          </div>
        </FadeInSection>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <FadeInSection>
            <div className="max-w-4xl mx-auto mb-16">
              <div className="flex flex-wrap gap-3 justify-center">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-theme-secondary text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <FadeInSection>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-theme-primary text-center mb-12">
                Related Posts
              </h2>
              <StaggerList>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <AnimatedCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                          {/* Hero Image */}
                          <div className="relative">
                            {relatedPost.hero_image ? (
                              <div className="h-48 rounded-t-xl overflow-hidden">
                                <img
                                  src={relatedPost.hero_image_url || `/api/placeholder/400/200`}
                                  alt={relatedPost.title}
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
                            {relatedPost.is_featured && (
                              <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-black text-xs font-medium rounded">
                                Featured
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <p className="text-gray-300 mb-4 line-clamp-3">
                              {relatedPost.summary}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {formatDate(relatedPost.published_at)}
                            </div>
                          </div>
                        </AnimatedCard>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </StaggerList>
            </div>
          </FadeInSection>
        )}

        {/* Newsletter Signup */}
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center">
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
