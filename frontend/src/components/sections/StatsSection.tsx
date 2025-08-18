'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Award, Star, ArrowRight, CheckCircle } from 'lucide-react';
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

  // Fallback stats if no live data
  const fallbackStats = [
    {
      id: '1',
      name: 'projects',
      value: 150,
      suffix: '+',
      label: 'Projects Delivered',
      icon_name: 'rocket',
      color_scheme: 'from-blue-500 to-cyan-500',
      description: 'Successfully completed projects across various industries',
      order: 1,
      is_active: true,
      created_at: '',
      updated_at: '',
      display_value: '150+'
    },
    {
      id: '2',
      name: 'clients',
      value: 50,
      suffix: '+',
      label: 'Happy Clients',
      icon_name: 'users',
      color_scheme: 'from-green-500 to-emerald-500',
      description: 'Satisfied clients who trust us with their digital transformation',
      order: 2,
      is_active: true,
      created_at: '',
      updated_at: '',
      display_value: '50+'
    },
    {
      id: '3',
      name: 'experience',
      value: 8,
      suffix: '+',
      label: 'Years Experience',
      icon_name: 'clock',
      color_scheme: 'from-purple-500 to-pink-500',
      description: 'Deep expertise in modern software development technologies',
      order: 3,
      is_active: true,
      created_at: '',
      updated_at: '',
      display_value: '8+'
    },
    {
      id: '4',
      name: 'satisfaction',
      value: 99,
      suffix: '%',
      label: 'Client Satisfaction',
      icon_name: 'award',
      color_scheme: 'from-yellow-500 to-orange-500',
      description: 'Consistently high satisfaction ratings from our clients',
      order: 4,
      is_active: true,
      created_at: '',
      updated_at: '',
      display_value: '99%'
    },
    {
      id: '5',
      name: 'support',
      value: 24,
      suffix: '/7',
      label: 'Support Available',
      icon_name: 'zap',
      color_scheme: 'from-red-500 to-pink-500',
      description: 'Round-the-clock support for all our deployed solutions',
      order: 5,
      is_active: true,
      created_at: '',
      updated_at: '',
      display_value: '24/7'
    },
    {
      id: '6',
      name: 'technologies',
      value: 15,
      suffix: '+',
      label: 'Technologies',
      icon_name: 'code',
      color_scheme: 'from-indigo-500 to-violet-500',
      description: 'Cutting-edge technologies we master and implement',
      order: 6,
      is_active: true,
      created_at: '',
      updated_at: '',
      display_value: '15+'
    }
  ];

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsApi.getAll({ limit: 6 });
        const liveStats = response.data.results || response.data;
        setStats(liveStats.length > 0 ? liveStats : fallbackStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Use live stats if available, otherwise fallback
  const displayStats = stats.length > 0 ? stats : fallbackStats;

  // Validate stats data structure
  const validStats = displayStats.filter(stat => 
    stat && 
    stat.id && 
    stat.name && 
    stat.value !== undefined && 
    stat.suffix !== undefined && 
    stat.label !== undefined
  );

  // If no valid stats, use fallback
  const finalStats = validStats.length > 0 ? validStats : fallbackStats;

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'trending-up': TrendingUp,
      'users': Users,
      'award': Award,
      'star': Star,
    };
    return iconMap[iconName] || TrendingUp;
  };

  useEffect(() => {
    if (!statsRef.current || !inView || hasAnimated) return;

    // GSAP animations for stats entrance
    const tl = gsap.timeline();
    
    // Animate counters
    countersRef.current.forEach((counter: HTMLSpanElement, index: number) => {
      if (!counter) return;
      
      const stat = finalStats[index];
      const targetNumber = stat.value;
      let currentNumber = 0;
      
      tl.to(counter, {
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          const progress = this.progress();
          currentNumber = Math.floor(targetNumber * progress);
          counter.textContent = currentNumber + stat.suffix;
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
  }, [inView, hasAnimated, finalStats]);

  // Hover effects for stat cards
  useEffect(() => {
    if (!statsRef.current) return;

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
  }, [hasAnimated]);

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
          {finalStats.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon_name);
            return (
            <motion.div
              key={stat.label}
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

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Global Reach & Innovation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">25+</div>
                <div className="text-indigo-100">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-indigo-100">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-indigo-100">Users Impacted</div>
              </div>
            </div>
          </div>
        </motion.div>

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
