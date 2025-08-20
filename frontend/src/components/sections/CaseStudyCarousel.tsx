'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, Play, Pause, Eye, Users, TrendingUp, Star, DollarSign } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { caseStudiesApi } from '@/lib/api';
import { CaseStudy } from '@/types';
import { gsap } from 'gsap';

const CaseStudyCarousel = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Fallback case studies if no live data
  const fallbackCaseStudies: CaseStudy[] = useMemo(() => [
    {
      id: '1',
      title: 'E-Commerce Platform Transformation',
      subtitle: 'How we helped TechCorp increase revenue by 240%',
      summary: 'Revolutionized a traditional retail business with a modern, scalable e-commerce solution.',
      description: 'A comprehensive e-commerce solution that transformed a traditional retail business into a digital powerhouse.',
      client_name: 'TechCorp Inc.',
      client_industry: 'Technology',
      category: 'ecommerce',
      project_duration: '6 months',
      team_size: '8 developers',
      challenge: 'TechCorp was experiencing high cart abandonment rates and poor user engagement.',
      solution: 'We redesigned the entire user interface and implemented advanced search with AI-powered recommendations.',
      approach: 'User-centered design approach with extensive A/B testing and optimization.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      tools: ['Figma', 'Jira', 'GitHub Actions'],
      business_objectives: ['Increase conversion rate', 'Reduce cart abandonment', 'Improve user engagement'],
      key_results: ['240% revenue increase', '180% conversion improvement', '320% user growth'],
      metrics: { revenue: '+240%', conversion: '+180%', users: '+320%', performance: '+85%' },
      roi: 'ROI: 340% in first year',
      is_featured: true,
      is_published: true,
      order: 1,
      reading_time: 5,
      has_metrics: true,
      has_testimonial: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      slug: 'ecommerce-platform'
    },
    {
      id: '2',
      title: 'AI-Powered Analytics Dashboard',
      subtitle: 'Revolutionizing data analytics with machine learning',
      summary: 'Built an intelligent analytics platform that provides real-time insights and predictive analytics.',
      description: 'An intelligent analytics platform that uses machine learning to provide actionable insights and predictive analytics for business intelligence.',
      client_name: 'DataFlow Inc.',
      client_industry: 'Technology',
      category: 'ai',
      project_duration: '8 months',
      team_size: '12 developers',
      challenge: 'DataFlow needed to process and analyze massive amounts of data to provide actionable business insights.',
      solution: 'We developed a comprehensive AI platform that processes data in real-time, providing predictive analytics and recommendations.',
      approach: 'We used an agile methodology with continuous stakeholder feedback, implementing advanced machine learning algorithms.',
      technologies: ['Python', 'TensorFlow', 'React', 'Docker'],
      tools: ['Jupyter', 'MLflow', 'Kubernetes'],
      business_objectives: ['Improve data insights', 'Reduce analysis time', 'Increase prediction accuracy'],
      key_results: ['180% revenue increase', '150% conversion improvement', '280% user growth'],
      metrics: { revenue: '+180%', conversion: '+150%', users: '+280%', performance: '+92%' },
      roi: 'ROI: 250% in first year',
      is_featured: true,
      is_published: true,
      order: 2,
      reading_time: 6,
      has_metrics: true,
      has_testimonial: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      slug: 'ai-analytics'
    },
    {
      id: '3',
      title: 'Mobile Banking Application',
      subtitle: 'Secure banking with biometric authentication',
      summary: 'Developed a secure, feature-rich mobile banking app with biometric authentication.',
      description: 'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
      client_name: 'FinanceBank',
      client_industry: 'Finance',
      category: 'mobile',
      project_duration: '10 months',
      team_size: '15 developers',
      challenge: 'FinanceBank needed a secure mobile banking solution with biometric authentication and real-time transaction processing.',
      solution: 'We developed a comprehensive mobile banking app with advanced security features, biometric authentication, and real-time transaction processing.',
      approach: 'We used a security-first approach with extensive testing, implementing industry-standard security protocols and biometric authentication.',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'Stripe'],
      tools: ['Figma', 'Jira', 'GitHub Actions'],
      business_objectives: ['Improve security', 'Enhance user experience', 'Increase mobile adoption'],
      key_results: ['300% revenue increase', '220% conversion improvement', '450% user growth'],
      metrics: { revenue: '+300%', conversion: '+220%', users: '+450%', performance: '+88%' },
      roi: 'ROI: 320% in first year',
      is_featured: true,
      is_published: true,
      order: 3,
      reading_time: 7,
      has_metrics: true,
      has_testimonial: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      slug: 'mobile-banking'
    },
    {
      id: '4',
      title: 'Cloud Infrastructure Migration',
      subtitle: 'Modernizing legacy systems with cloud-native solutions',
      summary: 'Migrated legacy systems to modern cloud infrastructure with automated deployment.',
      description: 'Migrated legacy systems to modern cloud infrastructure with automated deployment pipelines and monitoring.',
      client_name: 'CloudTech Solutions',
      client_industry: 'Technology',
      category: 'devops',
      project_duration: '4 months',
      team_size: '6 developers',
      challenge: 'CloudTech had legacy systems that were difficult to maintain and scale, requiring manual deployment processes.',
      solution: 'We migrated their infrastructure to modern cloud-native solutions with automated CI/CD pipelines and comprehensive monitoring.',
      approach: 'We used infrastructure as code principles with Terraform, implemented automated deployment pipelines, and added comprehensive monitoring.',
      technologies: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins'],
      tools: ['GitHub Actions', 'Prometheus', 'Grafana'],
      business_objectives: ['Improve scalability', 'Reduce deployment time', 'Enhance monitoring'],
      key_results: ['120% revenue increase', '90% conversion improvement', '200% user growth'],
      metrics: { revenue: '+120%', conversion: '+90%', users: '+200%', performance: '+95%' },
      roi: 'ROI: 180% in first year',
      is_featured: true,
      is_published: true,
      order: 4,
      reading_time: 4,
      has_metrics: true,
      has_testimonial: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      slug: 'cloud-migration'
    }
  ], []);

  // Fetch case studies from API
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await caseStudiesApi.getFeatured();
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
  }, [fallbackCaseStudies]);

  // Use live case studies if available, otherwise fallback
  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : fallbackCaseStudies;

  // Validate case studies data structure
  const validCaseStudies = displayCaseStudies.filter(study => 
    study && 
    study.id && 
    study.title && 
    study.metrics && 
    typeof study.metrics === 'object' &&
    study.metrics.revenue !== undefined &&
    study.metrics.users !== undefined &&
    study.metrics.conversion !== undefined &&
    study.metrics.performance !== undefined
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
                                  <div className="font-semibold text-gray-900 dark:text-white">{study.project_duration}</div>
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
                              {study.summary}
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
                                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{study.metrics?.revenue || 'N/A'}</div>
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
                                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{study.metrics?.users || 'N/A'}</div>
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
                                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{study.metrics?.conversion || 'N/A'}</div>
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
                                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{study.metrics?.performance || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="pt-4">
                            <AnimatedButton
                              variant="primary"
                              size="lg"
                              onClick={() => router.push(`/case-studies/${study.slug}`)}
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
