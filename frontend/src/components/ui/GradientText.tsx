'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'custom';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  shimmer?: boolean;
  className?: string;
  animate?: boolean;
}

const GradientText = ({
  children,
  variant = 'primary',
  size = 'base',
  weight = 'semibold',
  shimmer = false,
  className = '',
  animate = true,
}: GradientTextProps) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600',
    secondary: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500',
    accent: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500',
    custom: 'bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500',
  };

  const shimmerClasses = shimmer ? 'animate-shimmer bg-[length:200%_100%]' : '';

  const baseClasses = cn(
    'bg-clip-text text-transparent',
    sizeClasses[size],
    weightClasses[weight],
    variantClasses[variant],
    shimmerClasses,
    className
  );

  if (!animate) {
    return (
      <span className={baseClasses}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
