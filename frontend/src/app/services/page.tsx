'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, List, Search } from 'lucide-react';
import Link from 'next/link';
import { servicesApi } from '@/lib/api';
import { FadeInSection } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFilterSearchParams } from '@/hooks/useFilterSearchParams';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  icon: string;
  category: string;
  features: string[];
  order?: number;
}

const categories = [
  { id: 'all', name: 'All Services', color: 'bg-gray-500' },
  { id: 'web', name: 'Web Development', color: 'bg-blue-500' },
  { id: 'mobile', name: 'Mobile Development', color: 'bg-green-500' },
  { id: 'devops', name: 'DevOps', color: 'bg-purple-500' },
  { id: 'ai', name: 'AI & ML', color: 'bg-orange-500' },
  { id: 'consulting', name: 'Consulting', color: 'bg-teal-500' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    currentFilters,
    setCategory,
    setSearch,
    setOrdering,
    clearFilters,
  } = useFilterSearchParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await servicesApi.getAll();
        const allServices = response.data.results || response.data;
        setServices(allServices);
        
        // Apply filters
        let filtered = allServices;
        
        // Category filter
        if (currentFilters.category && currentFilters.category !== 'all') {
          filtered = filtered.filter((service: Service) => service.category === currentFilters.category);
        }
        
        // Search filter
        if (currentFilters.search) {
          filtered = filtered.filter((service: Service) => 
            service.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            service.short_desc.toLowerCase().includes(currentFilters.search.toLowerCase())
          );
        }
        
        // Ordering
        if (currentFilters.ordering === 'order') {
          filtered.sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0));
        } else if (currentFilters.ordering === 'name') {
          filtered.sort((a: Service, b: Service) => a.title.localeCompare(b.title));
        }
        
        setFilteredServices(filtered);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [currentFilters.category, currentFilters.search, currentFilters.ordering]);

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setSearch(search);
  };

  const handleOrderingChange = (ordering: string) => {
    setOrdering(ordering);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Services
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Comprehensive software development services designed to transform your business 
                  and drive innovation in the digital landscape.
                </p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      currentFilters.category === category.id
                        ? `${category.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Search and Ordering */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Ordering */}
                <select
                  value={currentFilters.ordering}
                  onChange={(e) => handleOrderingChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="order">Sort by Order</option>
                  <option value="name">Sort by Name</option>
                </select>

                {/* Clear Filters */}
                {(currentFilters.category !== 'all' || currentFilters.search || currentFilters.ordering !== 'order') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <AnimatedCard className="h-full">
                      <div className="relative overflow-hidden rounded-t-xl">
                        {/* Service Icon - Using live SVG from media */}
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-48 flex items-center justify-center">
                          {service.icon ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/media/icons/${service.icon}`}
                              alt={service.title}
                              className="w-24 h-24 object-contain"
                              onError={(e) => {
                                // Fallback to emoji if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          {/* Fallback emoji */}
                          <span className={`text-6xl ${service.icon ? 'hidden' : ''}`}>
                            {service.category === 'web' && '🌐'}
                            {service.category === 'mobile' && '📱'}
                            {service.category === 'devops' && '⚙️'}
                            {service.category === 'ai' && '🤖'}
                            {service.category === 'consulting' && '💼'}
                          </span>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
                            {service.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {service.short_desc}
                        </p>
                        
                        {/* Features Preview */}
                        {service.features && service.features.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Key Features:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {service.features.slice(0, 3).map((feature, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                              {service.features.length > 3 && (
                                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded">
                                  +{service.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Learn More Button */}
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                        >
                          Learn More
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
