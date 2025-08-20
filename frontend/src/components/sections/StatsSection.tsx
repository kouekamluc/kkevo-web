'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Award, Star, ArrowRight, CheckCircle, Rocket, Clock, Zap, Code, Globe } from 'lucide-react';
import { AnimatedButton } from '@/components/ui';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { statsApi } from '@/lib/api';
import { CompanyStats } from '@/types';

const StatsSection = () => {
  const router = useRouter();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [stats, setStats] = useState<CompanyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const { ref: inViewRef, inView } = useInView();
  const statsRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLSpanElement[]>([]);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await statsApi.getAll({ limit: 9, ordering: 'order' });
        const liveStats = response.data.results || response.data;
        
        if (liveStats && liveStats.length > 0) {
          setStats(liveStats);
        } else {
          console.warn('No stats data received from API');
          setStats([]);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'trending-up': TrendingUp,
      'users': Users,
      'award': Award,
      'star': Star,
      'rocket': Rocket,
      'clock': Clock,
      'zap': Zap,
      'code': Code,
      'globe': Globe,
    };
    return iconMap[iconName] || TrendingUp;
  };

  // Format large numbers for display
  const formatNumber = (value: number, suffix: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${suffix}`;
    }
    return `${value}${suffix}`;
  };

  useEffect(() => {
    if (!statsRef.current || !inView || hasAnimated || stats.length === 0) return;

    // GSAP animations for stats entrance
    const tl = gsap.timeline();
    
    // Animate counters
    countersRef.current.forEach((counter: HTMLSpanElement, index: number) => {
      if (!counter || !stats[index]) return;
      
      const stat = stats[index];
      const targetNumber = stat.value;
      let currentNumber = 0;
      
      tl.to(counter, {
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          const progress = this.progress();
          currentNumber = Math.floor(targetNumber * progress);
          counter.textContent = formatNumber(currentNumber, stat.suffix);
        }
      }, index * 0.1);
    });

    // Animate stat cards
    gsap.fromTo('.stat-card', 
      { 
        opacity: 0, 
        y: 50, 
        scale: 0.8,
        rotationY: -15
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );

    // Floating background elements
    gsap.to('.floating-stat', {
      y: -20,
      duration: 4,
      stagger: 0.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    setHasAnimated(true);

    return () => {
      tl.kill();
    };
  }, [inView, hasAnimated, stats]);

  // Hover effects for stat cards
  useEffect(() => {
    if (!statsRef.current || stats.length === 0) return;

    const statCards = statsRef.current.querySelectorAll('.stat-card');
    
    statCards.forEach((card: Element) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.05,
          y: -10,
          rotationY: 5,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
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
  }, [hasAnimated, stats]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 p-8 rounded-2xl h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no stats
  if (stats.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-4">Statistics are being updated</p>
            <p className="text-sm">Please check back later or contact our team for current metrics.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={inViewRef}
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="floating-stat absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="floating-stat absolute bottom-20 right-20 w-40 h-40 bg-violet-300 rounded-full blur-3xl"></div>
        <div className="floating-stat absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full blur-3xl"></div>
        <div className="floating-stat absolute top-1/3 right-1/4 w-20 h-20 bg-pink-300 rounded-full blur-3xl"></div>
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
            Our Impact in Numbers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Discover the scale of our success and the impact we've made for businesses worldwide
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div 
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon_name);
            return (
            <motion.div
              key={stat.id || stat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="stat-card group"
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 text-center relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color_scheme} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${stat.color_scheme} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Number */}
                <div className="relative z-10 mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    <span 
                      ref={(el) => {
                        if (el) countersRef.current[index] = el;
                      }}
                      className="inline-block"
                    >
                      0{stat.suffix}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {stat.label}
                  </div>
                </div>

                {/* Description */}
                <div className="relative z-10">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Hover effect indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to be part of our success story?
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
