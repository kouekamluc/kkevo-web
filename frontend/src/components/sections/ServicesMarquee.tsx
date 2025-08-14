'use client';

import { motion } from 'framer-motion';
import { Code, Smartphone, Cloud, Database, Shield, Zap, Globe, Rocket } from 'lucide-react';

const ServicesMarquee = () => {
  const services = [
    { name: 'Web Development', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { name: 'Mobile Apps', icon: Smartphone, color: 'from-green-500 to-emerald-500' },
    { name: 'Cloud Solutions', icon: Cloud, color: 'from-purple-500 to-pink-500' },
    { name: 'Database Design', icon: Database, color: 'from-orange-500 to-red-500' },
    { name: 'Cybersecurity', icon: Shield, color: 'from-red-500 to-pink-500' },
    { name: 'AI & ML', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { name: 'DevOps', icon: Rocket, color: 'from-indigo-500 to-purple-500' },
    { name: 'Digital Transformation', icon: Globe, color: 'from-teal-500 to-blue-500' },
  ];

  const marqueeVariants = {
    animate: {
      x: [0, -50 * services.length],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 20,
          ease: 'linear',
        },
      },
    },
  };

  const reverseMarqueeVariants = {
    animate: {
      x: [-50 * services.length, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 25,
          ease: 'linear',
        },
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <motion.div
              className="flex space-x-8"
              variants={marqueeVariants}
              animate="animate"
            >
              {[...services, ...services].map((service, index) => (
                <div
                  key={`${service.name}-${index}`}
                  className="flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center`}>
                    <service.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {service.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex space-x-8"
              variants={reverseMarqueeVariants}
              animate="animate"
            >
              {[...services, ...services].map((service, index) => (
                <div
                  key={`${service.name}-reverse-${index}`}
                  className="flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center`}>
                    <service.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {service.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to discuss your project?
          </p>
          <motion.button
            onClick={() => window.location.href = '/services'}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Services
            <Code className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesMarquee;
