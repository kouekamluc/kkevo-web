'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInSection } from '@/components/animations';

const TestimonialSlider = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials = [
    {
      id: 1,
      quote: "KKEVO transformed our business with their innovative software solutions. The team's expertise and dedication exceeded our expectations, delivering a platform that increased our efficiency by 300%.",
      client: "Sarah Johnson",
      company: "TechCorp Inc.",
      role: "CTO",
      rating: 5,
      logo: "/api/placeholder/100/50",
    },
    {
      id: 2,
      quote: "Working with KKEVO was a game-changer for our startup. They understood our vision perfectly and delivered a mobile app that our users love. The quality and attention to detail are outstanding.",
      client: "Michael Chen",
      company: "FinanceBank",
      role: "Founder & CEO",
      rating: 5,
      logo: "/api/placeholder/100/50",
    },
    {
      id: 3,
      quote: "KKEVO's cloud migration expertise saved us months of work and significantly reduced our infrastructure costs. Their team is professional, responsive, and truly understands modern software architecture.",
      client: "Emily Rodriguez",
      company: "DataFlow Systems",
      role: "VP of Engineering",
      rating: 5,
      logo: "/api/placeholder/100/50",
    },
    {
      id: 4,
      quote: "The AI-powered analytics dashboard KKEVO built for us has revolutionized how we make business decisions. The insights we're getting are invaluable, and the implementation was flawless.",
      client: "David Kim",
      company: "InsightMetrics",
      role: "Head of Data Science",
      rating: 5,
      logo: "/api/placeholder/100/50",
    },
    {
      id: 5,
      quote: "KKEVO delivered our e-commerce platform on time and within budget. The user experience is exceptional, and the performance improvements have directly impacted our bottom line.",
      client: "Lisa Thompson",
      company: "Retail Solutions",
      role: "Digital Director",
      rating: 5,
      logo: "/api/placeholder/100/50",
    },
  ];

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 15000); // Resume autoplay after 15 seconds
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 15000); // Resume autoplay after 15 seconds
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 15000); // Resume autoplay after 15 seconds
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with KKEVO.
            </p>
          </div>
        </FadeInSection>

        {/* Testimonials Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Slides */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
                  {/* Quote Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Quote className="w-8 h-8 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    {renderStars(testimonials[currentTestimonial].rating)}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentTestimonial].client.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonials[currentTestimonial].client}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial
                    ? 'bg-indigo-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <FadeInSection delay={0.3}>
          <div className="text-center mt-16">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Trusted by companies worldwide
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold">TechCorp</div>
              <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold">FinanceBank</div>
              <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold">DataFlow</div>
              <div className="text-gray-400 dark:text-gray-500 text-lg font-semibold">InsightMetrics</div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default TestimonialSlider;
