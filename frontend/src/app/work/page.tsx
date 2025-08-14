'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ExternalLink, Github, Eye, Calendar, Tag } from 'lucide-react';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
  client: string;
  year: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudy?: string;
}

// Mock data - in real app this would come from API
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A modern, scalable e-commerce platform built with Next.js and Node.js, featuring advanced search, payment integration, and admin dashboard.',
    category: 'web',
    image: '/api/placeholder/600/400',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'TailwindCSS'],
    client: 'TechCorp',
    year: '2024',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    caseStudy: '/work/ecommerce-platform'
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
    category: 'mobile',
    image: '/api/placeholder/600/800',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Biometrics', 'Redux'],
    client: 'FinanceBank',
    year: '2024',
    liveUrl: 'https://example.com',
    caseStudy: '/work/mobile-banking'
  },
  {
    id: '3',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Intelligent analytics platform that uses machine learning to provide actionable insights and predictive analytics for business intelligence.',
    category: 'ai',
    image: '/api/placeholder/600/500',
    technologies: ['Python', 'TensorFlow', 'React', 'D3.js', 'FastAPI'],
    client: 'DataFlow',
    year: '2023',
    githubUrl: 'https://github.com/example',
    caseStudy: '/work/ai-analytics'
  },
  {
    id: '4',
    title: 'DevOps Automation Platform',
    description: 'Comprehensive DevOps solution with CI/CD pipelines, infrastructure as code, and automated monitoring and alerting systems.',
    category: 'devops',
    image: '/api/placeholder/600/600',
    technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Prometheus'],
    client: 'CloudTech',
    year: '2023',
    caseStudy: '/work/devops-automation'
  },
  {
    id: '5',
    title: 'Healthcare Management System',
    description: 'HIPAA-compliant healthcare management platform with patient records, appointment scheduling, and telemedicine capabilities.',
    category: 'web',
    image: '/api/placeholder/600/700',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'WebRTC', 'Redis'],
    client: 'HealthCare Plus',
    year: '2023',
    liveUrl: 'https://example.com',
    caseStudy: '/work/healthcare-system'
  },
  {
    id: '6',
    title: 'Smart Home IoT Platform',
    description: 'Internet of Things platform for smart home automation with mobile app control, voice commands, and energy optimization.',
    category: 'mobile',
    image: '/api/placeholder/600/450',
    technologies: ['Flutter', 'Node.js', 'MQTT', 'MongoDB', 'AWS IoT'],
    client: 'SmartHome Inc',
    year: '2023',
    liveUrl: 'https://example.com',
    caseStudy: '/work/smart-home-iot'
  },
  {
    id: '7',
    title: 'Supply Chain Optimization',
    description: 'AI-driven supply chain management system with predictive analytics, route optimization, and real-time tracking capabilities.',
    category: 'ai',
    image: '/api/placeholder/600/550',
    technologies: ['Python', 'Scikit-learn', 'React', 'PostgreSQL', 'Docker'],
    client: 'LogiCorp',
    year: '2022',
    caseStudy: '/work/supply-chain-ai'
  },
  {
    id: '8',
    title: 'Real Estate CRM',
    description: 'Customer relationship management system for real estate agencies with lead management, property listings, and client communication tools.',
    category: 'web',
    image: '/api/placeholder/600/650',
    technologies: ['Angular', 'C#', 'SQL Server', 'SignalR', 'Azure'],
    client: 'RealEstate Pro',
    year: '2022',
    liveUrl: 'https://example.com',
    caseStudy: '/work/real-estate-crm'
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
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const openProjectModal = (project: Project) => {
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
            {filteredProjects.length === 0 ? (
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
                              {project.category}
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
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
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
                onClick={() => window.location.href = '/contact'}
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
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                    {selectedProject.caseStudy && (
                      <button
                        onClick={() => window.location.href = selectedProject.caseStudy!}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Read Case Study
                      </button>
                    )}
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
