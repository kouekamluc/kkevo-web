'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Filter, 
  Grid3X3, 
  List, 
  Search, 
  ExternalLink, 
  Eye, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Github, 
  Tag, 
  Calendar,
  Star,
  Award,
  Rocket,
  Zap,
  Target,
  Clock,
  Globe,
  Heart,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard, AnimatedButton, KkevoLogo } from '@/components/ui';
import Header from '@/components/layout/Header';

import { portfolioApi } from '@/lib/api';
import { Portfolio } from '@/types';



const categories = [
  { id: 'all', name: 'All Projects', icon: '🌟', color: 'from-gray-500 to-gray-600' },
  { id: 'web', name: 'Web Development', icon: '🌐', color: 'from-blue-500 to-indigo-600' },
  { id: 'mobile', name: 'Mobile Apps', icon: '📱', color: 'from-green-500 to-emerald-600' },
  { id: 'ai', name: 'AI & Machine Learning', icon: '🤖', color: 'from-orange-500 to-red-600' },
  { id: 'devops', name: 'DevOps & Infrastructure', icon: '⚙️', color: 'from-purple-500 to-pink-600' },
];

const stats = [
  { number: '50+', label: 'Projects Completed', icon: CheckCircle, color: 'text-green-500' },
  { number: '100%', label: 'Client Satisfaction', icon: Heart, color: 'text-red-500' },
  { number: '5+', label: 'Years Experience', icon: Award, color: 'text-yellow-500' },
  { number: '15+', label: 'Team Members', icon: Users, color: 'text-blue-500' },
];

export default function WorkPageClient() {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Portfolio[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.client.toLowerCase().includes(search) ||
        project.technologies.some(tech => tech.toLowerCase().includes(search))
      );
    }

    // Filter by technologies
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(project =>
        selectedTechnologies.some(tech => 
          project.technologies.some(projectTech => 
            projectTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(project => project.year === selectedYear);
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, searchTerm, selectedTechnologies, selectedYear, projects]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await portfolioApi.getAll();
        const portfolioData = response.data.results || response.data || [];
        
        setProjects(portfolioData);
        setFilteredProjects(portfolioData);
      } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        setError('Failed to load portfolio projects. Please try again.');
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

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '🌟';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'from-gray-500 to-gray-600';
  };

  // Get unique technologies from all projects
  const getAllTechnologies = () => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  };

  // Get unique years from all projects
  const getAllYears = () => {
    const yearSet = new Set<string>();
    projects.forEach(project => {
      if (project.year) yearSet.add(project.year);
    });
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a)); // Sort descending
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTechnologies([]);
    setSelectedYear('all');
    setSelectedCategory('all');
  };

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
                  <Rocket className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Our{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Work
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
                  Explore our portfolio of successful projects that demonstrate our expertise 
                  in delivering innovative software solutions across various industries.
                </p>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
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
                Find Your Perfect Project
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Use our advanced filters to explore projects that match your interests
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, technologies, clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </motion.button>
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
                  {/* Technology Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                      Filter by Technologies
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      {getAllTechnologies().map((tech) => (
                        <motion.button
                          key={tech}
                          onClick={() => {
                            setSelectedTechnologies(prev => 
                              prev.includes(tech) 
                                ? prev.filter(t => t !== tech)
                                : [...prev, tech]
                            );
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            selectedTechnologies.includes(tech)
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {tech}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                      Filter by Year
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      <motion.button
                        onClick={() => setSelectedYear('all')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                          selectedYear === 'all'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        All Years
                      </motion.button>
                      {getAllYears().map((year) => (
                        <motion.button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${
                            selectedYear === year
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {year}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || selectedTechnologies.length > 0 || selectedYear !== 'all' || selectedCategory !== 'all') && (
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
            
            {/* Category Filters */}
            <div className="text-center mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filter by Category
              </h4>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-xl`
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredProjects.length}</span> of <span className="font-semibold">{projects.length}</span> projects
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        {!isLoading && !error && filteredProjects.length > 0 && (
          <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {filteredProjects.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Projects Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {filteredProjects.filter(p => p.is_featured).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {new Set(filteredProjects.flatMap(p => p.technologies)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {new Set(filteredProjects.map(p => p.year)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Projects Grid */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-lg text-gray-600 dark:text-gray-400">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-red-500 text-4xl">⚠️</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Failed to load projects
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {searchTerm || selectedTechnologies.length > 0 || selectedYear !== 'all' || selectedCategory !== 'all'
                    ? 'No projects match your current filters'
                    : 'No projects found in this category'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || selectedTechnologies.length > 0 || selectedYear !== 'all' || selectedCategory !== 'all'
                    ? 'Try adjusting your search terms or filters to find more projects.'
                    : 'Try selecting a different category or check back later for new projects.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    View All Projects
                  </button>
                </div>
              </div>
            ) : (
              <StaggerList>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="group cursor-pointer"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatedCard className="h-full overflow-hidden group-hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600">
                        <div className="relative">
                          {/* Project Image Placeholder */}
                          <div className={`w-full h-48 bg-gradient-to-br ${getCategoryColor(project.category)} group-hover:brightness-110 transition-all duration-300 flex items-center justify-center`}>
                            <div className="text-6xl text-white opacity-80 group-hover:scale-110 transition-transform duration-300">
                              {getCategoryIcon(project.category)}
                            </div>
                          </div>
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          </div>
                          
                          {/* Featured Badge */}
                          {project.is_featured && (
                            <div className="absolute top-4 right-4">
                              <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                                <Star className="w-3 h-3 inline mr-1" />
                                Featured
                              </div>
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <div className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm">
                              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {/* Project Meta */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {project.year}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {project.duration}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                            {project.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                          
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-md font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          {/* Project Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
                  <Target className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Ready to Start Your Project?
                </h2>
                <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                  Let's discuss how we can help bring your vision to life with our expertise and proven track record.
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
                    Start Your Project
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
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(selectedProject.category)} text-white text-sm font-bold rounded-full`}>
                          {selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                        </span>
                        {selectedProject.is_featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                            <Star className="w-3 h-3 inline mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {selectedProject.title}
                      </h2>
                    </div>
                    <button
                      onClick={closeProjectModal}
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Project Image */}
                  <div className={`w-full h-64 bg-gradient-to-br ${getCategoryColor(selectedProject.category)} rounded-2xl mb-8 flex items-center justify-center`}>
                    <div className="text-8xl text-white opacity-80">
                      {getCategoryIcon(selectedProject.category)}
                    </div>
                  </div>
                  
                  {/* Project Content */}
                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Project Overview
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        {selectedProject.long_description || selectedProject.description}
                      </p>
                      
                      {/* Business Context */}
                      {selectedProject.challenge && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            🎯 Business Challenge
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {selectedProject.challenge}
                          </p>
                        </div>
                      )}

                      {selectedProject.solution && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            💡 Our Solution
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {selectedProject.solution}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-indigo-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>Client:</strong> {selectedProject.client}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-indigo-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>Year:</strong> {selectedProject.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-indigo-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>Duration:</strong> {selectedProject.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-indigo-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>Team Size:</strong> {selectedProject.team_size}
                          </span>
                        </div>
                        {selectedProject.budget_range && (
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              <strong>Budget:</strong> {selectedProject.budget_range}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {selectedProject.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Business Impact & ROI */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Business Impact & ROI
                      </h3>
                      
                      {/* Key Results */}
                      {selectedProject.key_results && selectedProject.key_results.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            🚀 Key Results
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.key_results.map((result, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                {result}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* ROI Metrics */}
                      {selectedProject.roi_metrics && Object.keys(selectedProject.roi_metrics).length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📊 ROI Metrics
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(selectedProject.roi_metrics).map(([key, value]) => (
                              <div key={key} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-lg text-center">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                                  {value}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                  {key.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Project Results */}
                      {selectedProject.results && Object.keys(selectedProject.results).length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            🎯 Project Results
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(selectedProject.results).map(([key, value]) => (
                              <div key={key} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-3 rounded-lg text-center">
                                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                  {value}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                  {key.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Testimonial */}
                  {selectedProject.client_testimonial && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                          "{selectedProject.client_testimonial}"
                        </blockquote>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>{selectedProject.client_name}</strong>
                          {selectedProject.client_role && `, ${selectedProject.client_role}`}
                          {selectedProject.client_company && ` at ${selectedProject.client_company}`}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
                      >
                        <ExternalLink className="w-5 h-5" />
                        View Live Project
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
                      >
                        <Github className="w-5 h-5" />
                        View Source Code
                      </a>
                    )}
                    <Link href={`/work/${selectedProject.slug}`}>
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Read Case Study
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
