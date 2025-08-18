'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, Play, Pause, Eye, Users, TrendingUp, Star, DollarSign } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { portfolioApi } from '@/lib/api';
import { Portfolio } from '@/types';
import { gsap } from 'gsap';

const CaseStudyCarousel = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caseStudies, setCaseStudies] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Fallback case studies if no live data
  const fallbackCaseStudies: Portfolio[] = [
    {
      id: '1',
      title: 'E-Commerce Platform Transformation',
      description: 'Revolutionized a traditional retail business with a modern, scalable e-commerce solution.',
      long_description: 'A comprehensive e-commerce solution that transformed a traditional retail business into a digital powerhouse.',
      category: 'web',
      client: 'TechCorp',
      year: '2024',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      duration: '6 months',
      team_size: '8 developers',
      results: {
        revenue: '+240%',
        conversion: '+180%',
        users: '+320%',
        performance: '+85%'
      },
      is_featured: true,
      order: 1,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 5,
      gallery_images: [],
      slug: 'ecommerce-platform'
    },
    {
      id: '2',
      title: 'AI-Powered Analytics Dashboard',
      description: 'Built an intelligent analytics platform that provides real-time insights and predictive analytics.',
      long_description: 'An intelligent analytics platform that uses machine learning to provide actionable insights and predictive analytics for business intelligence.',
      category: 'ai',
      client: 'DataFlow',
      year: '2024',
      technologies: ['Python', 'TensorFlow', 'React', 'Docker'],
      duration: '8 months',
      team_size: '12 developers',
      results: {
        revenue: '+180%',
        conversion: '+150%',
        users: '+280%',
        performance: '+92%'
      },
      is_featured: true,
      order: 2,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 6,
      gallery_images: [],
      slug: 'ai-analytics'
    },
    {
      id: '3',
      title: 'Mobile Banking Application',
      description: 'Developed a secure, feature-rich mobile banking app with biometric authentication.',
      long_description: 'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
      category: 'mobile',
      client: 'FinanceBank',
      year: '2024',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'Stripe'],
      duration: '10 months',
      team_size: '15 developers',
      results: {
        revenue: '+300%',
        conversion: '+220%',
        users: '+450%',
        performance: '+88%'
      },
      is_featured: true,
      order: 3,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 7,
      gallery_images: [],
      slug: 'mobile-banking'
    },
    {
      id: '4',
      title: 'Cloud Infrastructure Migration',
      description: 'Migrated legacy systems to modern cloud infrastructure with automated deployment.',
      long_description: 'Migrated legacy systems to modern cloud infrastructure with automated deployment pipelines and monitoring.',
      category: 'devops',
      client: 'CloudTech',
      year: '2023',
      technologies: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins'],
      duration: '4 months',
      team_size: '6 developers',
      results: {
        revenue: '+120%',
        conversion: '+90%',
        users: '+200%',
        performance: '+95%'
      },
      is_featured: true,
      order: 4,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      reading_time: 4,
      gallery_images: [],
      slug: 'cloud-migration'
    }
  ];

  // Fetch case studies from API
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await portfolioApi.getFeatured();
        const liveCaseStudies = response.data.results || response.data;
        setCaseStudies(liveCaseStudies.length > 0 ? liveCaseStudies : fallbackCaseStudies);
      } catch (error) {
        console.error('Error fetching case studies:', error);
        setCaseStudies(fallbackCaseStudies);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Use live case studies if available, otherwise fallback
  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : fallbackCaseStudies;

  // Validate case studies data structure
  const validCaseStudies = displayCaseStudies.filter(study => 
    study && 
    study.id && 
    study.title && 
    study.results && 
    typeof study.results === 'object' &&
    study.results.revenue !== undefined &&
    study.results.users !== undefined &&
    study.results.conversion !== undefined &&
    study.results.performance !== undefined
  );

  // If no valid case studies, use fallback
  const finalCaseStudies = validCaseStudies.length > 0 ? validCaseStudies : fallbackCaseStudies;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % finalCaseStudies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, finalCaseStudies.length]);

  useEffect(() => {
    if (!carouselRef.current || cardsRef.current.length === 0) return;

    // GSAP animations for card entrance
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Floating animation for background elements
    gsap.to('.floating-bg', {
      y: -20,
      duration: 4,
      stagger: 0.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Card hover effects
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.05,
          rotationY: 5,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          rotationY: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => {
      tl.kill();
    };
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % finalCaseStudies.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + finalCaseStudies.length) % finalCaseStudies.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="floating-bg absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="floating-bg absolute bottom-20 right-20 w-40 h-40 bg-violet-300 rounded-full blur-3xl"></div>
        <div className="floating-bg absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full blur-3xl"></div>
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
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Discover how we've transformed businesses with innovative software solutions
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </button>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {finalCaseStudies.map((study, index) => (
                <div
                  key={study.id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="max-w-4xl mx-auto"
                  >
                    <AnimatedCard className="overflow-hidden" gsapTilt>
                      <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* Left Side - Image and Category */}
                        <div className="space-y-6">
                          <div className="relative">
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-64 rounded-xl flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-black/20"></div>
                              <div className="relative z-10 text-center text-white">
                                <div className="text-6xl mb-4">🚀</div>
                                <div className="text-sm opacity-90">{study.category.charAt(0).toUpperCase() + study.category.slice(1)}</div>
                              </div>
                              
                              {/* Floating action buttons */}
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-2">
                                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Project stats overlay */}
                            <div className="absolute -bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                                  <div className="font-semibold text-gray-900 dark:text-white">{study.duration}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Team Size</div>
                                  <div className="font-semibold text-gray-900 dark:text-white">{study.team_size}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Technologies */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Technologies Used</h4>
                            <div className="flex flex-wrap gap-2">
                              {study.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="space-y-6">
                          <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mb-4">
                              <Star className="w-4 h-4 mr-2" />
                              Success Case Study
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                              {study.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {study.description}
                            </p>
                          </div>

                          {/* Results Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                  <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{study.results?.revenue || 'N/A'}</div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
                                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{study.results?.users || 'N/A'}</div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">Conversion</div>
                                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{study.results?.conversion || 'N/A'}</div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">Performance</div>
                                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{study.results?.performance || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="pt-4">
                            <AnimatedButton
                              variant="primary"
                              size="lg"
                              onClick={() => router.push('/work')}
                              className="w-full"
                            >
                              View Full Case Study
                              <ExternalLink className="w-5 h-5 ml-2" />
                            </AnimatedButton>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {finalCaseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-indigo-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to create your own success story?
          </p>
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={() => router.push('/contact')}
          >
            Start Your Project
            <ExternalLink className="w-5 h-5 ml-2" />
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyCarousel;
