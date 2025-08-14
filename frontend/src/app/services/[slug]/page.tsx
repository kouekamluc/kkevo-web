'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon: string;
  category: string;
  features: string[];
  order: number;
}

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description: 'We start by understanding your business goals, requirements, and technical constraints.',
    icon: '🔍',
  },
  {
    step: '02',
    title: 'Design & Architecture',
    description: 'Our team creates detailed technical specifications and user experience designs.',
    icon: '🎨',
  },
  {
    step: '03',
    title: 'Development & Testing',
    description: 'We build your solution using modern technologies and rigorous testing practices.',
    icon: '⚡',
  },
  {
    step: '04',
    title: 'Deployment & Launch',
    description: 'Your solution is deployed to production with monitoring and support.',
    icon: '🚀',
  },
  {
    step: '05',
    title: 'Maintenance & Support',
    description: 'Ongoing support, updates, and optimization to ensure long-term success.',
    icon: '🛠️',
  },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesApi.getBySlug(params.slug as string);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Service not found');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchService();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.location.href = '/services'}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title={service.title}
        description={service.short_desc}
        openGraph={{
          title: service.title,
          description: service.short_desc,
        }}
      />
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeInSection>
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mb-6">
                    {service.category}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    {service.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {service.short_desc}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Start Your Project
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      size="lg"
                      onClick={() => window.location.href = '/work'}
                    >
                      View Our Work
                    </AnimatedButton>
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-8xl">🚀</span>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center">
                    <span className="text-xl">💡</span>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Key Features
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Discover what makes our {service.title.toLowerCase()} service stand out from the competition.
                </p>
              </div>
            </FadeInSection>
            
            <StaggerList>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </StaggerList>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Process
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  A proven methodology that ensures your project's success from concept to deployment.
                </p>
              </div>
            </FadeInSection>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-indigo-200 dark:bg-indigo-800 hidden lg:block"></div>
              
              <div className="space-y-12">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center gap-8 ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                            <span className="text-2xl">{step.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {step.step}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="hidden lg:block w-8 h-8 bg-indigo-600 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
                    
                    <div className="flex-1"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Projects
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  See how we've delivered similar solutions for other clients.
                </p>
              </div>
            </FadeInSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = '/work'}
                >
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Project {index + 1}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    A successful implementation showcasing our expertise.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Let's discuss how our {service.title.toLowerCase()} service can help transform your business.
              </p>
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
            </FadeInSection>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
