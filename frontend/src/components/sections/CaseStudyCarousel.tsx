'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Eye } from 'lucide-react';
import { FadeInSection } from '@/components/animations';
import { AnimatedButton, AnimatedCard } from '@/components/ui';

const CaseStudyCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const caseStudies = [
    {
      id: 1,
      title: 'E-Commerce Platform Redesign',
      company: 'TechCorp Inc.',
      description: 'Complete redesign and development of a modern e-commerce platform with advanced features including AI-powered recommendations, real-time inventory management, and seamless payment integration.',
      category: 'Web Development',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      results: ['40% increase in conversion rate', '60% faster page load times', '25% reduction in cart abandonment'],
      link: '#',
      github: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      company: 'FinanceBank',
      description: 'Secure mobile banking application with biometric authentication, real-time transaction monitoring, and advanced security features for iOS and Android platforms.',
      category: 'Mobile Development',
      image: '/api/placeholder/600/400',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'Stripe', 'Apple Pay'],
      results: ['4.8/5 App Store rating', '2M+ active users', '99.9% uptime'],
      link: '#',
      github: '#',
      featured: true,
    },
    {
      id: 3,
      title: 'Cloud Infrastructure Migration',
      company: 'DataFlow Systems',
      description: 'Migration of legacy on-premise systems to cloud infrastructure with automated scaling, monitoring, and disaster recovery capabilities.',
      category: 'Cloud Solutions',
      image: '/api/placeholder/600/400',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
      results: ['70% reduction in infrastructure costs', '99.99% availability', '50% faster deployment'],
      link: '#',
      github: '#',
      featured: true,
    },
    {
      id: 4,
      title: 'AI-Powered Analytics Dashboard',
      company: 'InsightMetrics',
      description: 'Real-time analytics dashboard with machine learning capabilities for predictive insights and automated reporting.',
      category: 'AI & ML',
      image: '/api/placeholder/600/400',
      technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],
      results: ['90% accuracy in predictions', 'Real-time data processing', 'Automated insights generation'],
      link: '#',
      github: '#',
      featured: true,
    },
  ];

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, caseStudies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000); // Resume autoplay after 10 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000); // Resume autoplay after 10 seconds
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000); // Resume autoplay after 10 seconds
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Case Studies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover how we've helped businesses transform their operations with innovative software solutions
            </p>
          </div>
        </FadeInSection>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Previous case study"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Next case study"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex justify-center"
              >
                <AnimatedCard className="max-w-4xl w-full p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Image/Visual */}
                    <div className="relative">
                      <div className="w-full h-64 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-6xl mb-4">🚀</div>
                          <p className="text-lg font-medium">{caseStudies[currentSlide].title}</p>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium">
                          {caseStudies[currentSlide].category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {caseStudies[currentSlide].company}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {caseStudies[currentSlide].title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {caseStudies[currentSlide].description}
                      </p>

                      {/* Technologies */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {caseStudies[currentSlide].technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Results */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Results:</h4>
                        <ul className="space-y-2">
                          {caseStudies[currentSlide].results.map((result, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <AnimatedButton
                          variant="primary"
                          size="sm"
                          onClick={() => window.open(caseStudies[currentSlide].link, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Project
                        </AnimatedButton>
                        {caseStudies[currentSlide].github && (
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(caseStudies[currentSlide].github, '_blank')}
                          >
                            <Github className="w-4 h-4 mr-2" />
                            Code
                          </AnimatedButton>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-indigo-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <FadeInSection delay={0.3}>
          <div className="text-center mt-16">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Want to see more of our work?
            </p>
            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/work'}
            >
              View All Case Studies
              <ExternalLink className="w-5 h-5 ml-2" />
            </AnimatedButton>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default CaseStudyCarousel;
