'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/store';
import type { Theme } from '@/types';
import { AnimatedButton, KkevoLogo } from '@/components/ui';
import { useAppStore } from '@/store/useStore';
import { useLinkPrefetch } from '@/hooks';
import RoutePrefetcher from '@/components/providers/RoutePrefetcher';

// Theme icon component
const ThemeIcon = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  
  switch (theme) {
    case 'light':
      return <Sun className={className} />;
    case 'dark':
      return <Moon className={className} />;
    default:
      return <Monitor className={className} />;
  }
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Work', href: '/work' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources/django-saas-checklist' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <RoutePrefetcher />
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center">
                <KkevoLogo 
                  width={100} 
                  height={35} 
                  variant={resolvedTheme === 'dark' ? 'white' : 'default'}
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 relative group"
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-200 group-hover:w-full"></span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side - Theme toggle and CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={() => {
                  const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
                  const currentIndex = themes.indexOf(theme);
                  const nextIndex = (currentIndex + 1) % themes.length;
                  setTheme(themes[nextIndex]);
                }}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                title={`Current theme: ${theme}. Click to cycle through themes.`}
              >
                <ThemeIcon className="w-5 h-5" />
              </motion.button>

              {/* CTA Button */}
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={() => router.push('/contact')}
                className="px-6 py-2.5"
              >
                Get Started
              </AnimatedButton>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="px-4 py-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Theme:</span>
                    <motion.button
                      onClick={() => {
                        const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
                        const currentIndex = themes.indexOf(theme);
                        const nextIndex = (currentIndex + 1) % themes.length;
                        setTheme(themes[nextIndex]);
                      }}
                      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ThemeIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      router.push('/contact');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
