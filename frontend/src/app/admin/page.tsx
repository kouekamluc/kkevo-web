'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  Briefcase, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Database,
  Shield
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui';

const adminModules = [
  {
    name: 'Blog Management',
    description: 'Create, edit, and manage blog posts, categories, and content',
    href: '/admin/blog',
    icon: FileText,
    color: 'bg-blue-500',
    status: 'active'
  },
  {
    name: 'User Management',
    description: 'Manage user accounts, roles, and permissions',
    href: '/admin/users',
    icon: Users,
    color: 'bg-green-500',
    status: 'coming-soon'
  },
  {
    name: 'Services Management',
    description: 'Manage service offerings and pricing',
    href: '/admin/services',
    icon: Briefcase,
    color: 'bg-purple-500',
    status: 'coming-soon'
  },
  {
    name: 'Analytics Dashboard',
    description: 'View website analytics and performance metrics',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-orange-500',
    status: 'coming-soon'
  },
  {
    name: 'Contact Management',
    description: 'Manage contact form submissions and inquiries',
    href: '/admin/contacts',
    icon: MessageSquare,
    color: 'bg-red-500',
    status: 'coming-soon'
  },
  {
    name: 'Database Management',
    description: 'Database administration and maintenance tools',
    href: '/admin/database',
    icon: Database,
    color: 'bg-indigo-500',
    status: 'coming-soon'
  },
  {
    name: 'System Settings',
    description: 'Configure system-wide settings and preferences',
    href: '/admin/settings',
    icon: Settings,
    color: 'bg-gray-500',
    status: 'coming-soon'
  },
  {
    name: 'Security & Access',
    description: 'Manage security settings and access controls',
    href: '/admin/security',
    icon: Shield,
    color: 'bg-yellow-500',
    status: 'coming-soon'
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Manage your website content, users, and system settings from one central location
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <AnimatedCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">4</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</div>
          </AnimatedCard>
          
          <AnimatedCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
          </AnimatedCard>
          
          <AnimatedCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Services</div>
          </AnimatedCard>
          
          <AnimatedCard className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">25</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
          </AnimatedCard>
        </motion.div>

        {/* Admin Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {adminModules.map((module, index) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <AnimatedCard className="h-full p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {module.description}
                    </p>
                  </div>

                  {/* Status and Action */}
                  <div className="mt-auto">
                    {module.status === 'active' ? (
                      <Link href={module.href}>
                        <AnimatedButton className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                          Access Module
                        </AnimatedButton>
                      </Link>
                    ) : (
                      <div className="text-center">
                        <span className="inline-block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin/blog">
              <AnimatedButton className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Create New Blog Post
              </AnimatedButton>
            </Link>
            
            <Link href="/admin/blog">
              <AnimatedButton variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Blog Analytics
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}




