'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Filter, Grid3X3, List, Search, ExternalLink, Eye, Users, TrendingUp, ArrowRight, Github, Tag, Calendar } from 'lucide-react';
import Link from 'next/link';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { portfolioApi } from '@/lib/api';
import { Portfolio } from '@/types';
// Mock data - in real app this would come from API
const mockProjects: Portfolio[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A modern, scalable e-commerce platform built with Next.js and Node.js, featuring advanced search, payment integration, and admin dashboard.',
    long_description: 'A comprehensive e-commerce solution that transformed a traditional retail business into a digital powerhouse.',
    category: 'web',
    client: 'TechCorp',
    year: '2024',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'TailwindCSS'],
    duration: '6 months',
    team_size: '8 developers',
    results: {
      revenue: '+240%',
      conversion: '+180%',
      users: '+320%',
      performance: '+85%'
    },
    live_url: 'https://example.com',
    github_url: 'https://github.com/example',
    is_featured: true,
    order: 1,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 5,
    gallery_images: [],
    slug: 'ecommerce-platform'
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
    long_description: 'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
    category: 'mobile',
    client: 'FinanceBank',
    year: '2024',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Biometrics', 'Redux'],
    duration: '10 months',
    team_size: '15 developers',
    results: {
      revenue: '+300%',
      conversion: '+220%',
      users: '+450%',
      performance: '+88%'
    },
    live_url: 'https://example.com',
    is_featured: true,
    order: 2,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 7,
    gallery_images: [],
    slug: 'mobile-banking'
  },
  {
    id: '3',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Intelligent analytics platform that uses machine learning to provide actionable insights and predictive analytics for business intelligence.',
    long_description: 'An intelligent analytics platform that uses machine learning to provide actionable insights and predictive analytics for business intelligence.',
    category: 'ai',
    client: 'DataFlow',
    year: '2023',
    technologies: ['Python', 'TensorFlow', 'React', 'D3.js', 'FastAPI'],
    duration: '8 months',
    team_size: '12 developers',
    results: {
      revenue: '+180%',
      conversion: '+150%',
      users: '+280%',
      performance: '+92%'
    },
    github_url: 'https://github.com/example',
    is_featured: true,
    order: 3,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 6,
    gallery_images: [],
    slug: 'ai-analytics'
  },
  {
    id: '4',
    title: 'DevOps Automation Platform',
    description: 'Comprehensive DevOps solution with CI/CD pipelines, infrastructure as code, and automated monitoring and alerting systems.',
    long_description: 'A comprehensive DevOps solution with CI/CD pipelines, infrastructure as code, and automated monitoring and alerting systems.',
    category: 'devops',
    client: 'CloudTech',
    year: '2023',
    technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Prometheus'],
    duration: '4 months',
    team_size: '6 developers',
    results: {
      revenue: '+120%',
      conversion: '+90%',
      users: '+200%',
      performance: '+95%'
    },
    is_featured: true,
    order: 4,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 4,
    gallery_images: [],
    slug: 'devops-automation'
  },
  {
    id: '5',
    title: 'Healthcare Management System',
    description: 'HIPAA-compliant healthcare management platform with patient records, appointment scheduling, and telemedicine capabilities.',
    long_description: 'A HIPAA-compliant healthcare management platform with patient records, appointment scheduling, and telemedicine capabilities.',
    category: 'web',
    client: 'HealthCare Plus',
    year: '2023',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'WebRTC', 'Redis'],
    duration: '12 months',
    team_size: '10 developers',
    results: {
      revenue: '+150%',
      conversion: '+120%',
      users: '+250%',
      performance: '+90%'
    },
    live_url: 'https://example.com',
    is_featured: false,
    order: 5,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 8,
    gallery_images: [],
    slug: 'healthcare-system'
  },
  {
    id: '6',
    title: 'Smart Home IoT Platform',
    description: 'Internet of Things platform for smart home automation with mobile app control, voice commands, and energy optimization.',
    long_description: 'An Internet of Things platform for smart home automation with mobile app control, voice commands, and energy optimization.',
    category: 'mobile',
    client: 'SmartHome Inc',
    year: '2023',
    technologies: ['Flutter', 'Node.js', 'MQTT', 'MongoDB', 'AWS IoT'],
    duration: '9 months',
    team_size: '8 developers',
    results: {
      revenue: '+180%',
      conversion: '+140%',
      users: '+300%',
      performance: '+85%'
    },
    live_url: 'https://example.com',
    is_featured: false,
    order: 6,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 6,
    gallery_images: [],
    slug: 'smart-home-iot'
  },
  {
    id: '7',
    title: 'Supply Chain Optimization',
    description: 'AI-driven supply chain management system with predictive analytics, route optimization, and real-time tracking capabilities.',
    long_description: 'An AI-driven supply chain management system with predictive analytics, route optimization, and real-time tracking capabilities.',
    category: 'ai',
    client: 'LogiCorp',
    year: '2022',
    technologies: ['Python', 'Scikit-learn', 'React', 'PostgreSQL', 'Docker'],
    duration: '14 months',
    team_size: '12 developers',
    results: {
      revenue: '+200%',
      conversion: '+160%',
      users: '+350%',
      performance: '+88%'
    },
    is_featured: false,
    order: 7,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 9,
    gallery_images: [],
    slug: 'supply-chain-ai'
  },
  {
    id: '8',
    title: 'Real Estate CRM',
    description: 'Customer relationship management system for real estate agencies with lead management, property listings, and client communication tools.',
    long_description: 'A customer relationship management system for real estate agencies with lead management, property listings, and client communication tools.',
    category: 'web',
    client: 'RealEstate Pro',
    year: '2022',
    technologies: ['Angular', 'C#', 'SQL Server', 'SignalR', 'Azure'],
    duration: '11 months',
    team_size: '9 developers',
    results: {
      revenue: '+160%',
      conversion: '+130%',
      users: '+280%',
      performance: '+87%'
    },
    live_url: 'https://example.com',
    is_featured: false,
    order: 8,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reading_time: 7,
    gallery_images: [],
    slug: 'real-estate-crm'
  }
];

const categories = [
  { id: 'all', name: 'All Projects', color: 'bg-gray-500' },
  { id: 'web', name: 'Web Development', color: 'bg-blue-500' },
  { id: 'mobile', name: 'Mobile Apps', color: 'bg-green-500' },
  { id: 'ai', name: 'AI & Machine Learning', color: 'bg-orange-500' },
  { id: 'devops', name: 'DevOps & Infrastructure', color: 'bg-purple-500' },
];



export default function WorkPage() {
  const [projects, setProjects] = useState<Portfolio[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState<Portfolio[]>(mockProjects);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await portfolioApi.getAll();
        const liveProjects = response.data.results || response.data;
        setProjects(liveProjects.length > 0 ? liveProjects : []);
        setFilteredProjects(liveProjects.length > 0 ? liveProjects : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const openProjectModal = (project: Portfolio) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

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
                  Our Work
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Explore our portfolio of successful projects that demonstrate our expertise 
                  in delivering innovative software solutions across various industries.
                </p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl text-gray-600 dark:text-gray-400">
                  No projects found in this category.
                </h3>
              </div>
            ) : (
              <StaggerList>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="break-inside-avoid group cursor-pointer"
                      onClick={() => openProjectModal(project)}
                    >
                      <AnimatedCard className="overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <div className="relative">
                          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 group-hover:brightness-75 transition-all duration-300"></div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium rounded">
                              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {project.year}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {project.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {project.client}
                            </span>
                            <div className="flex gap-2">
                                                             {project.live_url && (
                                 <a
                                   href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                                                             {project.github_url && (
                                 <a
                                   href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
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
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Let's discuss how we can help bring your vision to life with our expertise and proven track record.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Start Your Project
              </button>
            </FadeInSection>
          </div>
        </section>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={closeProjectModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedProject.title}
                    </h2>
                    <button
                      onClick={closeProjectModal}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Project Details
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {selectedProject.description}
                      </p>
                                           <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <Tag className="w-4 h-4 text-gray-400" />
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Client: {selectedProject.client}
                         </span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-gray-400" />
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Year: {selectedProject.year}
                         </span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Tag className="w-4 h-4 text-gray-400" />
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Duration: {selectedProject.duration}
                         </span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Tag className="w-4 h-4 text-gray-400" />
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Team Size: {selectedProject.team_size}
                         </span>
                       </div>
                     </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                                     <div className="flex gap-4">
                     {selectedProject.live_url && (
                       <a
                         href={selectedProject.live_url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                       >
                         <ExternalLink className="w-4 h-4" />
                         View Live
                       </a>
                     )}
                     {selectedProject.github_url && (
                       <a
                         href={selectedProject.github_url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                       >
                         <Github className="w-4 h-4" />
                         View Code
                       </a>
                     )}
                     <button
                       onClick={() => router.push(`/work/${selectedProject.slug}`)}
                       className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                     >
                       Read Case Study
                     </button>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </main>
    </>
  );
}
