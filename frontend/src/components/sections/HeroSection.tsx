'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { AnimatedButton, KkevoLogo } from '@/components/ui';
import { useCompanyConfig } from '@/components/providers/CompanyConfigProvider';

const HeroSection = () => {
  const { config } = useCompanyConfig();
  
  // Use dynamic config or fallback to defaults
  const headline = config?.hero_headline || 'We Build Software That Moves Markets';
  const subtitle = config?.hero_subtitle || 'Transform your business with cutting-edge software solutions. From web applications to AI-powered systems, we deliver results that drive growth.';
  const features = config?.hero_features || [
    'Custom Software Development',
    'Web & Mobile Applications',
    'Cloud Infrastructure',
    'AI & Machine Learning',
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-theme-primary overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <KkevoLogo width={120} height={45} variant="colored" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-theme-primary mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {headline.split(' ').map((word, index) => {
            if (word.toLowerCase().includes('markets')) {
              return (
                <span key={index} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {word}{' '}
                </span>
              );
            }
            return <span key={index}>{word} </span>;
          })}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-theme-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/contact'}
            className="group px-8 py-4 text-lg"
          >
            Start Your Project
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </AnimatedButton>
          
          <AnimatedButton
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '/work'}
            className="px-8 py-4 text-lg"
          >
            <Play className="mr-3 h-6 w-6" />
            View Our Work
          </AnimatedButton>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              className="flex flex-col items-center space-y-3 text-theme-secondary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-center leading-tight">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-theme-accent mb-2">500+</div>
            <div className="text-theme-secondary text-sm font-medium">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-theme-accent mb-2">98%</div>
            <div className="text-theme-secondary text-sm font-medium">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-theme-accent mb-2">24/7</div>
            <div className="text-theme-secondary text-sm font-medium">Support Available</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="w-6 h-10 border-2 border-theme-secondary rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-theme-secondary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
