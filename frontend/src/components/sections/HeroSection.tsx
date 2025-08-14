'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowDown, Play, Star } from 'lucide-react';
import { FadeInSection } from '@/components/animations';
import { AnimatedButton, GradientText } from '@/components/ui';

const HeroSection = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // GSAP animation for the 3D globe effect
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(globeRef.current, {
      rotationY: 360,
      duration: 20,
      ease: 'none',
    });

    return () => {
      tl.kill();
    };
  }, []);

  const stats = [
    { number: '50+', label: 'Projects Delivered' },
    { number: '25+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '99%', label: 'Client Satisfaction' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Globe */}
        <div
          ref={globeRef}
          className="absolute top-20 right-10 w-96 h-96 opacity-10 dark:opacity-5"
        >
          <div className="w-full h-full rounded-full border-2 border-indigo-200 dark:border-indigo-800 relative">
            <div className="absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-800 transform rotate-45"></div>
            <div className="absolute inset-0 rounded-full border-2 border-teal-200 dark:border-teal-800 transform -rotate-45"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-32 left-20 w-4 h-4 bg-indigo-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-64 right-32 w-6 h-6 bg-violet-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <FadeInSection>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
              We Build Software That{' '}
              <GradientText variant="primary" size="5xl" weight="extrabold" shimmer>
                Moves Markets.
              </GradientText>
            </h1>
          </FadeInSection>

          {/* Subtitle */}
          <FadeInSection delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your business with cutting-edge software solutions. We deliver innovative, 
              scalable applications that drive growth and create competitive advantages.
            </p>
          </FadeInSection>

          {/* CTA Buttons */}
          <FadeInSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/contact'}
                className="group"
              >
                Start Your Project
                <Play className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </AnimatedButton>
              
              <AnimatedButton
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/work'}
              >
                View Our Work
              </AnimatedButton>
            </div>
          </FadeInSection>

          {/* Stats */}
          <FadeInSection delay={0.6}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInSection>

          {/* Trust Indicators */}
          <FadeInSection delay={1.0}>
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Trusted by leading companies worldwide
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
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400 dark:text-gray-500"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
