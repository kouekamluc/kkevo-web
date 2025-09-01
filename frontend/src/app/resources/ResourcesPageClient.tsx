'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  BookOpen, 
  FileText, 
  Code, 
  Video, 
  Star, 
  Eye, 
  Calendar,
  Tag,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard, AnimatedButton, KkevoLogo } from '@/components/ui';
import Header from '@/components/layout/Header';
import { resourcesApi, resourceCategoriesApi, resourceTypesApi } from '@/lib/api';
import { Resource, ResourceCategory, ResourceType } from '@/types';

export default function ResourcesPageClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [types, setTypes] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch resources, categories, and types in parallel
        const [resourcesResponse, categoriesResponse, typesResponse] = await Promise.all([
          resourcesApi.getAll(),
          resourceCategoriesApi.getAll(),
          resourceTypesApi.getAll()
        ]);
        
        setResources(resourcesResponse.data.results || resourcesResponse.data);
        setCategories(categoriesResponse.data.results || categoriesResponse.data);
        setTypes(typesResponse.data.results || typesResponse.data);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type.slug === selectedType);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category.slug === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(search) ||
        resource.description.toLowerCase().includes(search) ||
        resource.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Sort resources
    switch (sortBy) {
      case 'popular':
        filtered = filtered.sort((a, b) => b.download_count - a.download_count);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [resources, searchTerm, selectedType, selectedCategory, sortBy]);

  // Handle resource download
  const handleDownload = async (resource: Resource) => {
    try {
      // Record the download
      await resourcesApi.recordDownload(resource.slug);
      
      // Update local state
      setResources(prev => prev.map(r => 
        r.id === resource.id 
          ? { ...r, download_count: r.download_count + 1 }
          : r
      ));
      
      // Handle actual download
      if (resource.file) {
        // For actual files, trigger download
        const link = document.createElement('a');
        link.href = resource.file;
        link.download = resource.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (resource.external_url) {
        // For external URLs, open in new tab
        window.open(resource.external_url, '_blank');
      }
    } catch (err) {
      console.error('Error recording download:', err);
    }
  };

  // Handle resource rating
  const handleRating = async (resource: Resource, rating: number) => {
    try {
      await resourcesApi.rate(resource.slug, rating);
      
      // Update local state (simplified - in real app you'd get the updated data)
      setResources(prev => prev.map(r => 
        r.id === resource.id 
          ? { ...r, rating: rating, rating_count: r.rating_count + 1 }
          : r
      ));
    } catch (err) {
      console.error('Error rating resource:', err);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSortBy('popular');
  };

  const getTypeIcon = (typeSlug: string) => {
    const typeInfo = types.find(t => t.slug === typeSlug);
    if (!typeInfo) return BookOpen;
    
    // Map icon names to components
    const iconMap: { [key: string]: any } = {
      'BookOpen': BookOpen,
      'FileText': FileText,
      'Code': Code,
      'TrendingUp': TrendingUp,
      'Video': Video,
      'CheckCircle': CheckCircle,
    };
    
    return iconMap[typeInfo.icon] || BookOpen;
  };

  const getTypeColor = (typeSlug: string) => {
    const typeInfo = types.find(t => t.slug === typeSlug);
    return typeInfo ? typeInfo.color : 'from-gray-500 to-gray-600';
  };

  const getCategoryColor = (categorySlug: string) => {
    const catInfo = categories.find(c => c.slug === categorySlug);
    return catInfo ? catInfo.color : 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-lg text-gray-600">Loading resources...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Error Loading Resources
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                >
                  <BookOpen className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Free{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Resources
                  </span>
                </h1>
                
                <div className="flex justify-center mb-8">
                  <KkevoLogo 
                    width={120} 
                    height={40} 
                    variant="colored"
                    className="drop-shadow-lg"
                  />
                </div>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                  Access our comprehensive library of guides, templates, tools, and resources 
                  to accelerate your software development projects and business growth.
                </p>

                {/* Resource Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {resources.length}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Free Resources
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                      {resources.reduce((sum, r) => sum + r.download_count, 0).toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Downloads
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {types.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Resource Types
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {categories.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Categories
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Enhanced Filters Section */}
        <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Find the Perfect Resource
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Use our advanced filters to discover resources that match your needs
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, topics, technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Filter Toggle and Sort */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </motion.button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'rating')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 mb-8"
                >
                  {/* Resource Type Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                      Filter by Resource Type
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      <motion.button
                        key="all"
                        onClick={() => setSelectedType('all')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                          selectedType === 'all'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        All Resources
                      </motion.button>
                      {types.map((type) => (
                        <motion.button
                          key={type.slug}
                          onClick={() => setSelectedType(type.slug)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            selectedType === type.slug
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {React.createElement(getTypeIcon(type.slug), { className: "w-4 h-4" })}
                          {type.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                      Filter by Category
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      <motion.button
                        key="all"
                        onClick={() => setSelectedCategory('all')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                          selectedCategory === 'all'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        All Categories
                      </motion.button>
                      {categories.map((category) => (
                        <motion.button
                          key={category.slug}
                          onClick={() => setSelectedCategory(category.slug)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            selectedCategory === category.slug
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {category.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || selectedType !== 'all' || selectedCategory !== 'all') && (
                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="px-6 py-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 rounded-lg shadow-sm"
                      >
                        Clear All Filters
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredResources.length}</span> of <span className="font-semibold">{resources.length}</span> resources
              </p>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredResources.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No resources match your current filters
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or filters to find more resources.
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
                  {filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      className="group cursor-pointer"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatedCard className="h-full overflow-hidden group-hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600">
                        <div className="relative">
                          {/* Resource Thumbnail */}
                          <div className={`w-full h-48 bg-gradient-to-br ${getTypeColor(resource.type.slug)} group-hover:brightness-110 transition-all duration-300 flex items-center justify-center`}>
                            <div className="text-6xl text-white opacity-80 group-hover:scale-110 transition-transform duration-300">
                              {React.createElement(getTypeIcon(resource.type.slug), { className: "w-6 h-6" })}
                            </div>
                          </div>
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <Download className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          </div>
                          
                          {/* Featured Badge */}
                          {resource.is_featured && (
                            <div className="absolute top-4 right-4">
                              <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                                <Star className="w-3 h-3 inline mr-1" />
                                Featured
                              </div>
                            </div>
                          )}

                          {/* Premium Badge */}
                          {resource.is_premium && (
                            <div className="absolute top-4 left-4">
                              <div className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                                💎 Premium
                              </div>
                            </div>
                          )}
                          
                          {/* Type Badge */}
                          <div className="absolute bottom-4 left-4">
                            <div className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm">
                              {resource.format}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {/* Resource Meta */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(resource.category.slug)} text-white`}>
                              {resource.category.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {resource.estimated_time}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                            {resource.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                            {resource.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {resource.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-md font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {resource.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                                +{resource.tags.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          {/* Resource Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                {resource.download_count.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                <Star className="w-4 h-4 text-yellow-500" />
                                {resource.rating.toFixed(1)}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDownload(resource);
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                              >
                                Download
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
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
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="mb-12">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Need Custom Resources?
                </h2>
                <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                  Can't find what you're looking for? Let's create custom resources tailored to your specific needs.
                </p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/contact">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    className="px-10 py-5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors duration-200 shadow-xl hover:shadow-2xl text-lg"
                  >
                    Request Custom Resource
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </AnimatedButton>
                </Link>
                
                <Link href="/services">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="px-10 py-5 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200 text-lg"
                  >
                    View Our Services
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
