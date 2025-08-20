'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerList: React.FC<StaggerListProps> = ({ 
  children, 
  className = '', 
  staggerDelay = 0.1 
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
