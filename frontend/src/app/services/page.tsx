'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, List } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import { FadeInSection } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  icon: string;
  category: string;
  features: string[];
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        setServices(response.data.results || response.data);
        setFilteredServices(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.category === selectedCategory));
    }
  }, [selectedCategory, services]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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

        {/* Filters and View Toggle */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl text-gray-600 dark:text-gray-400">
                  No services found in this category.
                </h3>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AnimatedCard
                      className={`h-full cursor-pointer transition-all duration-300 hover:scale-105 ${
                        viewMode === 'list' ? 'flex items-center gap-6' : ''
                      }`}
                      onClick={() => window.location.href = `/services/${service.slug}`}
                    >
                      {viewMode === 'list' ? (
                        <>
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">🚀</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {service.short_desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.features.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🚀</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {service.short_desc}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Let's discuss how our services can help transform your business and drive growth.
              </p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Start Your Project
              </button>
            </FadeInSection>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
