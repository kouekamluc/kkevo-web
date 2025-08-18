'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { gsap } from 'gsap';
import { Quote, Star, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui';
import { Testimonial } from '@/types';

interface DisplayTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  project: string;
  results: string[];
}

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
}

const TestimonialSlider = ({ testimonials = [] }: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 300 });

    // Fallback testimonials if no live data
  const fallbackTestimonials: DisplayTestimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CTO at TechCorp',
      company: 'TechCorp Inc.',
      avatar: '/api/placeholder/100/100',
      quote: 'KKEVO transformed our entire digital infrastructure. Their team delivered a solution that exceeded our expectations in every way. The performance improvements alone have increased our user engagement by 300%.',
      rating: 5,
      project: 'E-Commerce Platform',
      results: ['300% user engagement', '85% performance boost', '40% cost reduction']
    },
    {
      id: '2',
      name: 'David Kim',
      role: 'VP of Engineering',
      company: 'FinanceBank',
      avatar: '/api/placeholder/100/100',
      quote: 'Working with KKEVO was a game-changer for our mobile banking app. Their expertise in fintech and security gave us confidence to launch with millions of users. The app now has a 4.9/5 rating.',
      rating: 5,
      project: 'Mobile Banking App',
      results: ['4.9/5 App Store rating', '2M+ active users', '99.99% uptime']
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'Product Manager',
      company: 'DataFlow Systems',
      avatar: '/api/placeholder/100/100',
      quote: 'The AI analytics dashboard KKEVO built for us has revolutionized how we make business decisions. Real-time insights and predictive analytics have given us a competitive edge in the market.',
      rating: 5,
      project: 'AI Analytics Platform',
      results: ['90% prediction accuracy', 'Real-time insights', 'Automated reporting']
      },
    {
      id: '4',
      name: 'Michael Chen',
      role: 'Operations Director',
      company: 'CloudTech Solutions',
      avatar: '/api/placeholder/100/100',
      quote: 'KKEVO\'s cloud migration expertise saved us months of planning and implementation time. Their automated deployment pipeline reduced our deployment time from days to minutes.',
      rating: 5,
      project: 'Cloud Infrastructure',
      results: ['70% cost reduction', '99.99% availability', '50% faster deployment']
    },
    {
      id: '5',
      name: 'Lisa Rodriguez',
      role: 'Marketing Director',
      company: 'Retail Innovations',
      avatar: '/api/placeholder/100/100',
      quote: 'The e-commerce platform KKEVO developed transformed our business model. We\'ve seen a 240% increase in revenue and our customers love the seamless shopping experience.',
      rating: 5,
      project: 'E-Commerce Platform',
      results: ['240% revenue increase', '180% conversion boost', '320% user growth']
    }
  ];

  // Use live testimonials if available, otherwise fallback
  const displayTestimonials: DisplayTestimonial[] = testimonials.length > 0 
    ? testimonials.map((testimonial: Testimonial) => ({
        id: testimonial.id,
        name: testimonial.client,
        role: 'Client',
        company: testimonial.company,
        avatar: '/api/placeholder/100/100',
        quote: testimonial.quote,
        rating: testimonial.rating,
        project: 'Custom Project',
        results: ['High satisfaction', 'Quality delivery', 'Professional service']
      }))
    : fallbackTestimonials;

  useEffect(() => {
    if (!sliderRef.current || cardsRef.current.length === 0) return;

    // GSAP animations for card entrance and floating effects
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Floating background elements
    gsap.to('.floating-testimonial', {
      y: -15,
      duration: 3,
      stagger: 0.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Card hover effects with GSAP
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.02,
          y: -5,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
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

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, displayTestimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
    setDragDirection(null);
  };

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragDirection(info.offset.x > 0 ? 'right' : 'left');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="floating-testimonial absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="floating-testimonial absolute bottom-20 right-20 w-40 h-40 bg-violet-300 rounded-full blur-3xl"></div>
        <div className="floating-testimonial absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full blur-3xl"></div>
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
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Don't just take our word for it. Here's what our clients have to say about working with KKEVO.
          </motion.p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative">
          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </button>

            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </button>
          </div>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="overflow-hidden"
          >
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              whileDrag={{ cursor: 'grabbing' }}
            >
              {displayTestimonials.map((testimonial: DisplayTestimonial, index: number) => (
                <div
                  key={testimonial.id}
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
                    <AnimatedCard className="p-8 text-center" gsapTilt>
                      {/* Quote Icon */}
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto">
                          <Quote className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Testimonial Content */}
                      <div className="mb-8">
                        <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                          "{testimonial.quote}"
                        </blockquote>
                      </div>

                      {/* Author Info */}
                      <div className="mb-8">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white text-lg">
                              {testimonial.name}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {testimonial.role}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, i: number) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>

                        {/* Project Info */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                          {testimonial.project}
                        </div>
                      </div>

                      {/* Results */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {testimonial.results.map((result: string, resultIndex: number) => (
                          <div
                            key={resultIndex}
                            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800"
                          >
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                              {result}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-violet-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / displayTestimonials.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {displayTestimonials.map((_: DisplayTestimonial, index: number) => (
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
            Ready to join our satisfied clients?
          </p>
          <Link href="/contact" className="inline-block">
            <button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Start Your Project
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
