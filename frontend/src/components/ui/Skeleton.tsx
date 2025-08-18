'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }: SkeletonProps) => {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${width} ${height} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default Skeleton;
