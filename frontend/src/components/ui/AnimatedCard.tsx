'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
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
}: AnimatedCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(1, springConfig);

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
      
      {/* Subtle gradient overlay for depth */}
      {tilt && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none" />
      )}
    </motion.div>
  );
};

export default AnimatedCard;
