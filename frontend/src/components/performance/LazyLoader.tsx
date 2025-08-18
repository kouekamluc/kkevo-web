'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

interface LazyLoaderProps {
  component: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  className?: string;
}

const LazyLoader = ({ component, fallback, className }: LazyLoaderProps) => {
  const LazyComponent = lazy(component);

  const defaultFallback = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse ${className || ''}`}
    >
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    </motion.div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent />
    </Suspense>
  );
};

export default LazyLoader;
