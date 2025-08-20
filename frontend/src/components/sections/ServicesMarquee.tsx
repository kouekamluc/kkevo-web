'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Code, Smartphone, Cloud, Database, Shield, Zap, Globe, Rocket, Cpu, Palette, ArrowRight } from 'lucide-react';
import { Service } from '@/types';

interface ServicesMarqueeProps {
  services?: Service[];
}

// Helper function to get icon based on service category
const getServiceIcon = (category: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'web-development': Code,
    'mobile-development': Smartphone,
    'devops-cloud': Cloud,
    'ai-ml': Cpu,
    'consulting': Palette,
  };
  return iconMap[category] || Code;
};

// Helper function to get color based on service category
const getServiceColor = (category: string) => {
  const colorMap: Record<string, string> = {
    'web': 'from-blue-500 to-cyan-500',
    'mobile': 'from-green-500 to-emerald-500',
    'cloud': 'from-purple-500 to-pink-500',
    'backend': 'from-orange-500 to-red-500',
    'security': 'from-red-500 to-pink-500',
    'ai': 'from-yellow-500 to-orange-500',
    'devops': 'from-indigo-500 to-purple-500',
    'consulting': 'from-teal-500 to-blue-500',
    'design': 'from-pink-500 to-rose-500',
    'architecture': 'from-gray-500 to-slate-500',
  };
  return colorMap[category] || 'from-blue-500 to-cyan-500';
};

const ServicesMarquee = ({ services = [] }: ServicesMarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const reverseMarqueeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fallback services if no live data
  const fallbackServices = [
    { name: 'Web Development', icon: Code, color: 'from-blue-500 to-cyan-500', category: 'frontend' },
    { name: 'Mobile Apps', icon: Smartphone, color: 'from-green-500 to-emerald-500', category: 'mobile' },
    { name: 'Cloud Solutions', icon: Cloud, color: 'from-purple-500 to-pink-500', category: 'cloud' },
    { name: 'Database Design', icon: Database, color: 'from-orange-500 to-red-500', category: 'backend' },
    { name: 'Cybersecurity', icon: Shield, color: 'from-red-500 to-pink-500', category: 'security' },
    { name: 'AI & ML', icon: Zap, color: 'from-yellow-500 to-orange-500', category: 'ai' },
    { name: 'DevOps', icon: Rocket, color: 'from-indigo-500 to-purple-500', category: 'devops' },
    { name: 'Digital Transformation', icon: Globe, color: 'from-teal-500 to-blue-500', category: 'consulting' },
    { name: 'UI/UX Design', icon: Palette, color: 'from-pink-500 to-rose-500', category: 'design' },
    { name: 'System Architecture', icon: Cpu, color: 'from-gray-500 to-slate-500', category: 'architecture' },
  ];

  // Use live services if available, otherwise fallback
  const displayServices = services.length > 0 
    ? services.map(service => ({
        name: service.title,
        icon: getServiceIcon(service.category),
        color: getServiceColor(service.category),
        category: service.category
      }))
    : fallbackServices;

  useEffect(() => {
    if (!marqueeRef.current || !reverseMarqueeRef.current) return;

    // GSAP infinite scroll animation
    const tl1 = gsap.timeline({ repeat: -1 });
    const tl2 = gsap.timeline({ repeat: -1 });

    // First row - left to right
    tl1.to(marqueeRef.current, {
      x: -50 * displayServices.length,
      duration: 25,
      ease: 'none',
    });

    // Second row - right to left
    tl2.to(reverseMarqueeRef.current, {
      x: 50 * displayServices.length,
      duration: 30,
      ease: 'none',
    });

    // Hover effects for service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          y: -5,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    return () => {
      tl1.kill();
      tl2.kill();
    };
  }, [services.length, displayServices.length]);

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Our Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            We specialize in a wide range of software development services to meet your business needs
          </motion.p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* First Row - Left to Right */}
          <div className="flex overflow-hidden mb-8">
            <div
              ref={marqueeRef}
              className="flex space-x-8"
            >
              {[...displayServices, ...displayServices].map((service, index) => (
                <div
                  key={`${service.name}-${index}`}
                  className="service-item flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0 cursor-pointer group hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {service.name}
                  </span>
                  
                  {/* Hover indicator */}
                  <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="flex overflow-hidden">
            <div
              ref={reverseMarqueeRef}
              className="flex space-x-8"
            >
              {[...displayServices, ...displayServices].map((service, index) => (
                <div
                  key={`reverse-${service.name}-${index}`}
                  className="service-item flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0 cursor-pointer group hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {service.name}
                  </span>
                  
                  {/* Hover indicator */}
                  <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 dark:from-gray-800 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent pointer-events-none"></div>
        </div>

        {/* Interactive Service Categories */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Explore by Category
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {Array.from(new Set(displayServices.map(s => s.category))).map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {category}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {displayServices.filter(s => s.category === category).length} services
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to get started with your project?
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
          >
            Get Free Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesMarquee;
