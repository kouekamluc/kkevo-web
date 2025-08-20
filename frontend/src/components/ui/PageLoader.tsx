'use client';

import { motion } from 'framer-motion';
import { KkevoLogo } from './index';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PageLoader = ({ message = 'Loading...', size = 'md' }: PageLoaderProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center"
      >
        {/* Logo with animation */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="mb-8"
        >
          <KkevoLogo width={80} height={30} variant="colored" />
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-indigo-600 rounded-full mx-auto mb-6`}
        />

        {/* Loading message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`${textSizes[size]} text-gray-600 dark:text-gray-400 font-medium`}
        >
          {message}
        </motion.p>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center space-x-2 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
              className="w-2 h-2 bg-indigo-600 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PageLoader;
