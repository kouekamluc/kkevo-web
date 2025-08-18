'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, ArrowDown, ChevronRight, Star, Users, Zap, Award, Rocket } from 'lucide-react';
import { FadeInSection } from '@/components/animations';
import { AnimatedButton, GradientText } from '@/components/ui';
import { useAppStore } from '@/store/useStore';
import { gsap } from 'gsap';

const HeroSection = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const { openContactForm } = useAppStore();
  const router = useRouter();
  const ctaButtonRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!globeRef.current || !ctaButtonRef.current || !floatingElementsRef.current) return;

    // GSAP timeline for complex animations
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // 3D Globe rotation and morphing
    tl.to(globeRef.current, {
      rotationY: 360,
      rotationX: 15,
      duration: 20,
      ease: 'none',
    })
    .to(globeRef.current, {
      scale: 1.1,
      duration: 4,
      ease: 'power2.inOut',
    }, 0)
    .to(globeRef.current, {
      rotationZ: 180,
      duration: 15,
      ease: 'none',
    }, 0);

    // Floating elements animation
    const floatingElements = floatingElementsRef.current.children;
    gsap.to(floatingElements, {
      y: -20,
      duration: 3,
      stagger: 0.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Magnetic effect for CTA button
    const button = ctaButtonRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(button, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tl.kill();
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Ripple effect for CTA button
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

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
        {/* Enhanced 3D Globe */}
        <div
          ref={globeRef}
          className="absolute top-20 right-10 w-96 h-96 opacity-20 dark:opacity-10 transform-style-3d"
        >
          <div className="w-full h-full rounded-full border-2 border-indigo-200 dark:border-indigo-800 relative transform-style-3d">
            <div className="absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-800 transform rotate-45"></div>
            <div className="absolute inset-0 rounded-full border-2 border-teal-200 dark:border-teal-800 transform -rotate-45"></div>
            <div className="absolute inset-0 rounded-full border-2 border-pink-200 dark:border-pink-800 transform rotate-90"></div>
            
            {/* Globe continents */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-green-400/20 transform rotate-12"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-red-400/20 transform -rotate-12"></div>
            
            {/* Orbital rings */}
            <div className="absolute inset-0 rounded-full border border-indigo-300/30 transform rotate-30 scale-110"></div>
            <div className="absolute inset-0 rounded-full border border-violet-300/30 transform -rotate-30 scale-120"></div>
          </div>
        </div>

        {/* Floating Elements with enhanced animations */}
        <div ref={floatingElementsRef} className="absolute inset-0">
          <div className="absolute top-32 left-20 w-4 h-4 bg-indigo-400 rounded-full opacity-60 animate-pulse">
            <div className="absolute inset-0 w-full h-full bg-indigo-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute top-64 right-32 w-6 h-6 bg-violet-400 rounded-full opacity-40 animate-pulse delay-1000">
            <div className="absolute inset-0 w-full h-full bg-violet-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-pulse delay-2000">
            <div className="absolute inset-0 w-full h-full bg-teal-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-70 animate-pulse delay-1500"></div>
          <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-yellow-400 rounded-full opacity-30 animate-pulse delay-3000"></div>
        </div>

        {/* Particle system */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => {
            // Use deterministic values to prevent hydration mismatch
            const left = (i * 5.5) % 100; // Spread particles evenly
            const top = (i * 7.3) % 100; // Different multiplier for variety
            const delay = (i * 0.3) % 5; // Staggered animation delays
            const duration = 3 + (i % 4); // 3-6 seconds duration
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-indigo-300 rounded-full opacity-40"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              >
                <div className="w-full h-full bg-indigo-300 rounded-full animate-ping"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline with enhanced animation */}
          <FadeInSection>
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              We Build Software That{' '}
              <GradientText variant="primary" size="5xl" weight="extrabold" shimmer>
                Moves Markets.
              </GradientText>
            </motion.h1>
          </FadeInSection>

          {/* Subtitle with staggered animation */}
          <FadeInSection delay={0.2}>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Transform your business with cutting-edge software solutions. We deliver innovative, 
              scalable applications that drive growth and create competitive advantages.
            </motion.p>
          </FadeInSection>

          {/* Enhanced CTA Buttons with ripple effects */}
          <FadeInSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                ref={ctaButtonRef}
                className="group relative overflow-hidden"
              >
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    router.push('/contact');
                  }}
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Project
                    <Play className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </AnimatedButton>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/work')}
                  className="group"
                >
                  <span className="flex items-center">
                    View Our Work
                    <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform duration-200" />
                  </span>
                </AnimatedButton>
              </motion.div>
            </div>
          </FadeInSection>

          {/* Enhanced Stats Section */}
          <FadeInSection delay={0.6}>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </FadeInSection>

          {/* Scroll indicator */}
          <FadeInSection delay={1.2}>
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <motion.div
                className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          </FadeInSection>
        </div>
      </div>

      {/* Enhanced floating action elements */}
      <div className="absolute bottom-8 right-8 space-y-4">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <Zap className="w-6 h-6" />
        </motion.div>
        
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.1, rotate: -360 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          <Rocket className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Ripple effect styles */}
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
