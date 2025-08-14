'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Code, Award, TrendingUp, Clock, Star, Zap, Globe } from 'lucide-react';
import { FadeInSection, StaggerList } from '@/components/animations';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    satisfaction: 0,
    experience: 0,
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);

  const stats = [
    {
      icon: Code,
      number: 50,
      suffix: '+',
      label: 'Projects Delivered',
      color: 'from-blue-500 to-cyan-500',
      description: 'Successfully completed software projects across various industries',
    },
    {
      icon: Users,
      number: 25,
      suffix: '+',
      label: 'Happy Clients',
      color: 'from-green-500 to-emerald-500',
      description: 'Long-term partnerships built on trust and exceptional results',
    },
    {
      icon: Star,
      number: 99,
      suffix: '%',
      label: 'Client Satisfaction',
      color: 'from-yellow-500 to-orange-500',
      description: 'Consistently exceeding client expectations and delivering value',
    },
    {
      icon: Clock,
      number: 5,
      suffix: '+',
      label: 'Years Experience',
      color: 'from-purple-500 to-pink-500',
      description: 'Deep expertise in modern software development practices',
    },
    {
      icon: TrendingUp,
      number: 300,
      suffix: '%',
      label: 'Average ROI',
      color: 'from-red-500 to-pink-500',
      description: 'Measurable business impact and return on investment',
    },
    {
      icon: Globe,
      number: 15,
      suffix: '+',
      label: 'Countries Served',
      color: 'from-indigo-500 to-violet-500',
      description: 'Global reach with local expertise and cultural understanding',
    },
  ];

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      
      // Animate counts
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      const animateCounts = () => {
        let currentStep = 0;
        
        const interval = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;
          
          setCounts({
            projects: Math.floor(50 * progress),
            clients: Math.floor(25 * progress),
            satisfaction: Math.floor(99 * progress),
            experience: Math.floor(5 * progress),
          });

          if (currentStep >= steps) {
            clearInterval(interval);
            setCounts({
              projects: 50,
              clients: 25,
              satisfaction: 99,
              experience: 5,
            });
          }
        }, stepDuration);
      };

      animateCounts();
    }
  }, [isInView, hasAnimated]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We measure our success by the impact we create for our clients and the value we deliver
            </p>
          </div>
        </FadeInSection>

        {/* Stats Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StaggerList className="contents">
            {stats.map((stat, index) => (
              <FadeInSection key={stat.label} delay={index * 0.1}>
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.icon === Code && counts.projects}
                    {stat.icon === Users && counts.clients}
                    {stat.icon === Star && counts.satisfaction}
                    {stat.icon === Clock && counts.experience}
                    {stat.icon === TrendingUp && 300}
                    {stat.icon === Globe && 15}
                    <span className="text-indigo-600 dark:text-indigo-400">{stat.suffix}</span>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </motion.div>
              </FadeInSection>
            ))}
          </StaggerList>
        </div>

        {/* Additional Info */}
        <FadeInSection delay={0.6}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Let's discuss how we can help transform your business with innovative software solutions. 
                Our track record speaks for itself, and we're ready to add your success story to our portfolio.
              </p>
              <motion.button
                onClick={() => window.location.href = '/contact'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
                <Zap className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default StatsSection;
