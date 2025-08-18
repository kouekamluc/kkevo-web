'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useStore';
import { useIsReducedMotion } from '@/hooks';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    action: 'mailto:hello@kkevo.com',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    icon: Phone,
    label: 'Call',
    action: 'tel:+15551234567',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    icon: MapPin,
    label: 'Location',
    action: 'https://maps.google.com',
    color: 'bg-purple-500 hover:bg-purple-600'
  }
];

export default function FloatingContactBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { openContactForm } = useAppStore();
  const isReducedMotion = useIsReducedMotion();
  const router = useRouter();

  useEffect(() => {
    // Show bubble after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleBubble = () => {
    setIsOpen(!isOpen);
  };

  const handleContactForm = () => {
    setIsOpen(false);
    openContactForm();
    router.push('/contact');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: isReducedMotion ? 0 : 0.2 }}
            className="absolute bottom-16 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            {/* Arrow */}
            <div className="absolute bottom-0 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white dark:border-t-gray-800 transform translate-y-full"></div>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Get in Touch
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ready to start your project?
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-2 mb-4">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg text-white transition-colors ${method.color}`}
                >
                  <method.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{method.label}</span>
                </a>
              ))}
            </div>

            {/* Contact Form Button */}
            <button
              onClick={handleContactForm}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Send Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bubble */}
      <motion.button
        onClick={toggleBubble}
        whileHover={{ scale: isReducedMotion ? 1 : 1.1 }}
        whileTap={{ scale: isReducedMotion ? 1 : 0.95 }}
        transition={{ duration: isReducedMotion ? 0 : 0.2 }}
        className="w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Contact us"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: isReducedMotion ? 0 : 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: isReducedMotion ? 0 : 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse Effect */}
      {!isOpen && !isReducedMotion && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-16 h-16 bg-indigo-400 rounded-full opacity-30"
        />
      )}
    </div>
  );
}
