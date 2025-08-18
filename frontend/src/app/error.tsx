'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Home, RefreshCw, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-32 h-32 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Something Went Wrong
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              We're sorry, but something unexpected happened. Our team has been notified 
              and is working to fix the issue.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Error Details (Development):
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={reset}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </AnimatedButton>
              
              <AnimatedButton
                variant="outline"
                size="lg"
                onClick={() => router.push('/')}
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </AnimatedButton>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-medium mb-2">Contact Support:</p>
                  <p>Email: support@kkevo.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Common Solutions:</p>
                  <p>• Refresh the page</p>
                  <p>• Clear browser cache</p>
                  <p>• Try a different browser</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
