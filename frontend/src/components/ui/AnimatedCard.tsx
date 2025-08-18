'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  hover?: boolean;
  scale?: boolean;
  shadow?: boolean;
  border?: boolean;
  onClick?: () => void;
  gsapTilt?: boolean;
  magnetic?: boolean;
}

const AnimatedCard = ({
  children,
  className = '',
  tilt = true,
  hover = true,
  scale = true,
  shadow = true,
  border = false,
  onClick,
  gsapTilt = false,
  magnetic = false,
}: AnimatedCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(1, springConfig);

  // GSAP tilt animation
  useEffect(() => {
    if (!gsapTilt || !gsapRef.current) return;

    const card = gsapRef.current;
    let isHovered = false;

    const handleMouseEnter = () => {
      isHovered = true;
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      gsap.to(card, {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -15;
      const rotateY = (mouseX / (rect.width / 2)) * 15;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mousemove', handleMouseMove);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gsapTilt]);

  // Magnetic effect
  useEffect(() => {
    if (!magnetic || !cardRef.current) return;

    const card = cardRef.current;
    let isHovered = false;

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const magneticX = mouseX * 0.1;
      const magneticY = mouseY * 0.1;

      gsap.to(card, {
        x: magneticX,
        y: magneticY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mousemove', handleMouseMove);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [magnetic]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    
    x.set(0);
    y.set(0);
    springScale.set(1);
  };

  const handleMouseEnter = () => {
    if (!hover || !scale) return;
    springScale.set(1.02);
  };

  const baseClasses = cn(
    'relative bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 cursor-pointer',
    border && 'border border-gray-200 dark:border-gray-700',
    shadow && 'shadow-lg hover:shadow-2xl',
    className
  );

  // Use GSAP tilt if enabled
  if (gsapTilt) {
    return (
      <div
        ref={gsapRef}
        className={baseClasses}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        onClick={onClick}
      >
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Enhanced gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-xl pointer-events-none" />
        
        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-xl border border-transparent hover:border-indigo-200/20 dark:hover:border-indigo-700/20 transition-colors duration-300" />
      </div>
    );
  }

  // Use Framer Motion tilt
  return (
    <motion.div
      ref={cardRef}
      className={baseClasses}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: tilt ? springRotateX : 0,
        rotateY: tilt ? springRotateY : 0,
        scale: scale ? springScale : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileHover={hover ? { y: -5 } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Enhanced gradient overlay for depth */}
      {tilt && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-xl pointer-events-none" />
      )}
      
      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-transparent hover:border-indigo-200/20 dark:hover:border-indigo-700/20 transition-colors duration-300" />
      
      {/* Enhanced shadow effect */}
      {shadow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  );
};

export default AnimatedCard;
