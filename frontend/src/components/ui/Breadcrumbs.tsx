'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHome = true,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />
}) => {
  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {allItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {separator}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.href && index < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-white">
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;







