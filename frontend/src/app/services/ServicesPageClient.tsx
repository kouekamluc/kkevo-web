'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, TrendingUp, ArrowRight, ChevronDown, ChevronUp, CheckCircle, Zap, Target, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';
import { servicesApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, KkevoLogo, PageLoader } from '@/components/ui';
import Header from '@/components/layout/Header';

import { useDataCache } from '@/hooks';
import { Service } from '@/types';
import { config } from '@/lib/config';

const categories = [
  { id: 'all', name: 'All Categories', color: 'bg-gray-500', icon: '🚀' },
  { id: 'web-development', name: 'Web Development', color: 'bg-blue-500', icon: '🌐' },
  { id: 'mobile-development', name: 'Mobile Development', color: 'bg-green-500', icon: '📱' },
  { id: 'cloud-solutions', name: 'Cloud Solutions', color: 'bg-purple-500', icon: '☁️' },
  { id: 'ai-ml', name: 'AI & Machine Learning', color: 'bg-red-500', icon: '🤖' },
  { id: 'devops', name: 'DevOps & Infrastructure', color: 'bg-orange-500', icon: '⚙️' },
  { id: 'consulting', name: 'Consulting', color: 'bg-indigo-500', icon: '💼' },
  { id: 'design', name: 'UI/UX Design', color: 'bg-pink-500', icon: '🎨' }
];

const complexityLevels = [
  { id: 'all', name: 'All Levels', color: 'bg-gray-500', icon: '📊' },
  { id: 'beginner', name: 'Beginner', color: 'bg-green-500', icon: '🌱' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-500', icon: '⚡' },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-500', icon: '🚀' }
];

export default function ServicesPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  // Use the new caching system
  const { data: servicesResponse, isLoading, error } = useDataCache(
    'services-list',
    () => servicesApi.getAll(),
    { 
      ttl: 10 * 60 * 1000, // 10 minutes cache
      enabled: config.prefetch.enabled && (typeof window === 'undefined' || !(window as any).__DISABLE_PREFETCH__)
    }
  );

  const filteredServices = useMemo(() => {
    const services = servicesResponse?.data?.results || servicesResponse?.data || [];
    const base: Service[] = Array.isArray(services) ? services.slice() : [];

    let filtered = base;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((service: Service) =>
        service.title.toLowerCase().includes(search) ||
        service.short_desc.toLowerCase().includes(search) ||
        service.long_desc.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service: Service) => service.category === selectedCategory);
    }

    // Apply complexity filter - use features for now since complexity_levels is not in the frontend interface
    if (selectedComplexity !== 'all') {
      const complexity = selectedComplexity.toLowerCase();
      filtered = filtered.filter((service: Service) => 
        Array.isArray(service.features) && service.features.some(feature => 
          String(feature).toLowerCase().includes(complexity)
        )
      );
    }

    // Apply sorting (on a copy to avoid mutating source)
    const sorted = filtered.slice().sort((a: Service, b: Service) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'order':
          return (a.order || 0) - (b.order || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [servicesResponse?.data, searchTerm, selectedCategory, selectedComplexity, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleComplexityChange = (complexity: string) => {
    setSelectedComplexity(complexity);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedComplexity('all');
    setSortBy('name');
  };

  const getServiceIcon = (serviceName: string) => {
    const iconMap: Record<string, string> = {
      'web-development': '🌐',
      'mobile-development': '📱',
      'cloud-solutions': '☁️',
      'ai-ml': '🤖',
      'devops': '⚙️',
      'consulting': '💼',
      'design': '🎨'
    };
    
    return iconMap[serviceName] || '🚀';
  };

  // Check if backend is offline
  const isBackendOffline = typeof window !== 'undefined' && (window as any).__DISABLE_PREFETCH__;

  if (isBackendOffline) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Backend Offline
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The backend service is currently unavailable. Please start the backend or check your connection.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mr-3"
            >
              Retry
            </button>
            <button
              onClick={() => {
                (window as any).enablePrefetch();
                window.location.reload();
              }}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Enable API
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader message="Loading services..." size="lg" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Error Loading Services
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || 'Failed to load services. Please try again later.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full border-2 border-white"></div>
            <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full border-2 border-white"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Rocket className="w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Our Services
                </h1>
                
                <div className="flex justify-center mb-6">
                  <KkevoLogo 
                    width={100} 
                    height={35} 
                    variant="white"
                  />
                </div>
                <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Comprehensive solutions tailored to transform your business. From web development to AI consulting, 
                  we deliver excellence at every step.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span>100+ Projects Completed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Star className="w-4 h-4" />
                    <span>5-Star Rated</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Shield className="w-4 h-4" />
                    <span>Enterprise Security</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our comprehensive range of services designed to accelerate your digital transformation
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {categories.slice(1).map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">Expert Solutions</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-12 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Find Your Perfect Service
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services, features, or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Category Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            selectedCategory === category.id
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Complexity Level</h4>
                    <div className="flex flex-wrap gap-3">
                      {complexityLevels.map((level) => (
                        <motion.button
                          key={level.id}
                          onClick={() => handleComplexityChange(level.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            selectedComplexity === level.id
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {level.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort By</h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'name', name: 'Name', icon: '🔤' },
                        { id: 'order', name: 'Order', icon: '📊' },
                        { id: 'category', name: 'Category', icon: '🎯' },
                        { id: 'created', name: 'Date', icon: '⏰' }
                      ].map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => setSortBy(option.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            sortBy === option.id
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="mr-2">{option.icon}</span>
                          {option.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || selectedCategory !== 'all' || selectedComplexity !== 'all' || sortBy !== 'name') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-6 py-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 rounded-lg shadow-sm"
                    >
                      Clear All Filters
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Available Services
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {filteredServices.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>All Services Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Premium Quality</span>
                  </div>
                </div>
              )}
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No services found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <StaggerList>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/services/${service.slug}`}>
                        <motion.div
                          className="group cursor-pointer h-full"
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="h-full group-hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800 rounded-xl">
                            <div className="relative">
                              {/* Service Icon */}
                              <div className="w-full h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <div className="text-6xl">{getServiceIcon(service.category)}</div>
                              </div>
                              
                              {/* Category Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm">
                                  {service.category}
                                </div>
                              </div>

                              {/* Active Status */}
                              {service.is_active && (
                                <div className="absolute top-4 right-4">
                                  <div className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                    Active
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-6">
                              {/* Title */}
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                                {service.title}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                {service.short_desc}
                              </p>
                              
                              {/* Features Preview */}
                              {service.features && service.features.length > 0 && (
                                <div className="mb-6">
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Key Features:
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {service.features.slice(0, 3).map((feature, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-md font-medium"
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                    {service.features.length > 3 && (
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                                        +{service.features.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Service Meta */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Zap className="w-4 h-4" />
                                    <span>Order: {service.order}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                  <span className="text-sm font-medium">Learn More</span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </StaggerList>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Let's discuss your project requirements and find the perfect solution for your needs. 
                  Our expert team is ready to help you succeed.
                </p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/contact">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </AnimatedButton>
                </Link>
                
                <Link href="/about">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200"
                  >
                    Learn More About Us
                  </AnimatedButton>
                </Link>
              </motion.div>
            </FadeInSection>
          </div>
        </section>

      </main>
    </>
  );
}
