'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ExternalLink, Eye } from 'lucide-react';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';

import { Service } from '@/types';

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description: 'We start by understanding your business goals, requirements, and technical constraints.',
    icon: '🔍',
    duration: '2-3 weeks',
    deliverables: ['Requirements Document', 'Project Timeline', 'Technical Architecture']
  },
  {
    step: '02',
    title: 'Design & Architecture',
    description: 'Our team creates detailed technical specifications and user experience designs.',
    icon: '🎨',
    duration: '3-4 weeks',
    deliverables: ['UI/UX Designs', 'Technical Specifications', 'Database Schema']
  },
  {
    step: '03',
    title: 'Development & Testing',
    description: 'We build your solution using modern technologies and rigorous testing practices.',
    icon: '⚡',
    duration: '8-12 weeks',
    deliverables: ['Core Application', 'Testing Reports', 'Documentation']
  },
  {
    step: '04',
    title: 'Deployment & Launch',
    description: 'Your solution is deployed to production with monitoring and support.',
    icon: '🚀',
    duration: '1-2 weeks',
    deliverables: ['Production Deployment', 'Performance Monitoring', 'Launch Support']
  },
  {
    step: '05',
    title: 'Maintenance & Support',
    description: 'Ongoing support, updates, and optimization to ensure long-term success.',
    icon: '🛠️',
    duration: 'Ongoing',
    deliverables: ['24/7 Support', 'Regular Updates', 'Performance Optimization']
  },
];

const relatedProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with advanced features and seamless user experience.',
    image: '/api/placeholder/400/300',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    results: ['40% increase in conversion rate', '60% faster page load times']
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication.',
    image: '/api/placeholder/400/300',
    category: 'Mobile Development',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    results: ['4.8/5 App Store rating', '2M+ active users']
  },
  {
    id: '3',
    title: 'AI Analytics Dashboard',
    description: 'Intelligent analytics platform with machine learning capabilities.',
    image: '/api/placeholder/400/300',
    category: 'AI & ML',
    technologies: ['Python', 'TensorFlow', 'React'],
    results: ['90% accuracy in predictions', 'Real-time insights']
  },
  {
    id: '4',
    title: 'Cloud Infrastructure',
    description: 'Scalable cloud infrastructure with automated deployment.',
    image: '/api/placeholder/400/300',
    category: 'DevOps',
    technologies: ['AWS', 'Docker', 'Kubernetes'],
    results: ['70% reduction in costs', '99.99% availability']
  }
];

interface ServiceDetailClientProps {
  service: Service & {
    pricing_tiers?: Record<string, string>;
    timeline_estimates?: Record<string, string>;
    budget_ranges?: Record<string, string>;
    complexity_levels?: string[];
    deliverables?: string[];
    average_project_duration?: string;
    success_rate?: number;
    display_budget_range?: string;
    display_timeline?: string;
  };
}

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  return (
    <>
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full border-2 border-indigo-200 dark:border-indigo-800"></div>
            <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full border-2 border-violet-200 dark:border-violet-800"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    <Link href="/contact" className="inline-block">
                      <AnimatedButton
                        variant="primary"
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-gray-100"
                      >
                        Start Your Project
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </AnimatedButton>
                    </Link>
                    <Link href="/work" className="inline-block">
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                      >
                        View Our Work
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <div className="relative">
                  {/* Animated SVG Icon */}
                  <div 
                    className="w-80 h-80 bg-gradient-to-br from-indigo-500 via-violet-600 to-teal-500 rounded-full mx-auto flex items-center justify-center shadow-2xl"
                  >
                    <div className="text-8xl filter drop-shadow-lg">
                      {service.category === 'web' && '🌐'}
                      {service.category === 'mobile' && '📱'}
                      {service.category === 'devops' && '⚙️'}
                      {service.category === 'ai' && '🤖'}
                      {service.category === 'consulting' && '💼'}
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <motion.div 
                    className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                      y: [-10, 10, -10],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <span className="text-2xl">✨</span>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-4 -left-4 w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                      y: [10, -10, 10],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <span className="text-xl">💡</span>
                  </motion.div>
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
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ y: -5 }}
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

        {/* Pricing & Details Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Pricing & Project Details
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Transparent pricing and detailed project information to help you make informed decisions.
                </p>
              </div>
            </FadeInSection>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Pricing Tiers */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Pricing Tiers
                </h3>
                <div className="space-y-4">
                  {service.pricing_tiers && Object.entries(service.pricing_tiers).map(([tier, price], index) => (
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{tier}</h4>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{price}</span>
                      </div>
                      {service.timeline_estimates?.[tier] && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Timeline: {service.timeline_estimates[tier]}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {service.display_budget_range && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Budget Range:</strong> {service.display_budget_range}
                    </p>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Project Information
                </h3>
                <div className="space-y-4">
                  {service.average_project_duration && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <span className="text-2xl">⏱️</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Average Duration</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.average_project_duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {service.success_rate && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Success Rate</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.success_rate}%</p>
                      </div>
                    </div>
                  )}
                  
                  {service.complexity_levels && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Complexity Levels</p>
                      <div className="flex flex-wrap gap-2">
                        {service.complexity_levels.map((level, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables Section */}
        {service.deliverables && service.deliverables.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeInSection>
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    What You'll Receive
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Comprehensive deliverables that ensure your project's success and long-term value.
                  </p>
                </div>
              </FadeInSection>
              
              <StaggerList>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.deliverables.map((deliverable, index) => (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {deliverable}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </StaggerList>
            </div>
          </section>
        )}

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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-200 via-violet-200 to-teal-200 dark:from-indigo-800 dark:via-violet-800 dark:to-teal-800 hidden lg:block"></div>
              
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
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">{step.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {step.step}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {step.title}
                            </h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Duration: {step.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {step.description}
                        </p>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deliverables:
                          </div>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {step.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="hidden lg:block w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full border-4 border-white dark:border-gray-900 z-10 shadow-lg"></div>
                    
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
            
            {/* Horizontal Scroll Container */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {relatedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-shrink-0 w-80 group cursor-pointer"
                  >
                    <Link href="/work" className="block">
                      <AnimatedCard className="h-full">
                        <div className="relative overflow-hidden rounded-t-xl">
                          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 h-48 flex items-center justify-center">
                            <span className="text-6xl">
                              {project.category === 'Web Development' && '🌐'}
                              {project.category === 'Mobile Development' && '📱'}
                              {project.category === 'AI & ML' && '🤖'}
                              {project.category === 'DevOps' && '⚙️'}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-2">
                              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mb-3">
                            {project.category}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {project.description}
                          </p>
                          
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Technologies:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {project.results.map((result, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                {result}
                              </div>
                            ))}
                          </div>
                        </div>
                      </AnimatedCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Scroll Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA - Sticky Bottom */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Let's discuss how our {service.title.toLowerCase()} service can help transform your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-block">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                  >
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </AnimatedButton>
                </Link>
                <Link href="/services" className="inline-block">
                  <AnimatedButton
                    variant="ghost"
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-indigo-600"
                  >
                    Explore All Services
                  </AnimatedButton>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>

      </main>
    </>
  );
}
