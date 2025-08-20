'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Home, ArrowRight, AlertTriangle } from 'lucide-react';
import { AnimatedButton, KkevoLogo } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  const router = useRouter();

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
            {/* 404 Animation */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-9xl md:text-[12rem] font-bold text-indigo-600 dark:text-indigo-400 mb-4"
              >
                404
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Page Not Found
            </h1>
            
            <div className="flex justify-center mb-6">
              <KkevoLogo 
                width={100} 
                height={35} 
                variant="colored"
              />
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>

            {/* Search Suggestion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try searching for what you're looking for:
              </p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search our site..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => router.push('/')}
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </AnimatedButton>
              
              <AnimatedButton
                variant="outline"
                size="lg"
                onClick={() => router.back()}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Go Back
              </AnimatedButton>
            </motion.div>

            {/* Popular Pages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Or visit one of these popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: 'Services', href: '/services' },
                  { name: 'About', href: '/about' },
                  { name: 'Work', href: '/work' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Contact', href: '/contact' }
                ].map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {page.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
