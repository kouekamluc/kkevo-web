'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const FadeInSection: React.FC<FadeInSectionProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
