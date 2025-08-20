'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  CheckCircle, 
  Globe, 
  Rocket, 
  Zap,
  Heart,
  Target,
  Lightbulb,
  Shield,
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { teamApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard, KkevoLogo } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social_links: Record<string, string>;
}

const companyTimeline = [
  {
    year: '2019',
    title: 'Company Founded',
    description: 'KKEVO was established with a vision to transform businesses through innovative software solutions.',
    icon: '🚀',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    year: '2020',
    title: 'First Major Client',
    description: 'Successfully delivered our first enterprise-level project, establishing our reputation for quality.',
    icon: '🎯',
    color: 'from-green-500 to-emerald-600',
  },
  {
    year: '2021',
    title: 'Team Expansion',
    description: 'Grew our team to 15+ developers and designers, expanding our service offerings.',
    icon: '👥',
    color: 'from-purple-500 to-pink-600',
  },
  {
    year: '2022',
    title: 'AI & ML Division',
    description: 'Launched our artificial intelligence and machine learning services division.',
    icon: '🤖',
    color: 'from-orange-500 to-red-600',
  },
  {
    year: '2023',
    title: 'Global Recognition',
    description: 'Received industry awards and expanded our client base to international markets.',
    icon: '🌍',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    year: '2024',
    title: 'Future Forward',
    description: 'Continuing to innovate and lead in emerging technologies and digital transformation.',
    icon: '🔮',
    color: 'from-indigo-500 to-purple-600',
  },
];

const techStack = [
  { name: 'React', icon: '⚛️', category: 'Frontend', color: 'from-blue-500 to-cyan-500' },
  { name: 'Node.js', icon: '🟢', category: 'Backend', color: 'from-green-500 to-emerald-500' },
  { name: 'Python', icon: '🐍', category: 'Backend', color: 'from-yellow-500 to-orange-500' },
  { name: 'Django', icon: '🎯', category: 'Framework', color: 'from-green-600 to-teal-600' },
  { name: 'AWS', icon: '☁️', category: 'Cloud', color: 'from-orange-500 to-red-500' },
  { name: 'Docker', icon: '🐳', category: 'DevOps', color: 'from-blue-600 to-indigo-600' },
  { name: 'TensorFlow', icon: '🧠', category: 'AI/ML', color: 'from-orange-600 to-amber-600' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database', color: 'from-blue-700 to-indigo-700' },
  { name: 'TypeScript', icon: '📘', category: 'Language', color: 'from-blue-500 to-indigo-500' },
  { name: 'Next.js', icon: '⚡', category: 'Framework', color: 'from-gray-800 to-black' },
  { name: 'Kubernetes', icon: '☸️', category: 'DevOps', color: 'from-blue-500 to-cyan-500' },
  { name: 'GraphQL', icon: '🔷', category: 'API', color: 'from-pink-500 to-rose-500' },
];

const companyStats = [
  { number: '100+', label: 'Projects Completed', icon: CheckCircle, color: 'text-green-500' },
  { number: '50+', label: 'Happy Clients', icon: Heart, color: 'text-red-500' },
  { number: '15+', label: 'Team Members', icon: Users, color: 'text-blue-500' },
  { number: '5+', label: 'Years Experience', icon: Award, color: 'text-yellow-500' },
];

const values = [
  { 
    icon: Target, 
    title: 'Excellence', 
    description: 'We strive for excellence in every project, no matter the size.',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    icon: Users, 
    title: 'Collaboration', 
    description: 'We believe the best solutions come from working together.',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    icon: Lightbulb, 
    title: 'Innovation', 
    description: 'We constantly explore new technologies and approaches.',
    color: 'from-yellow-500 to-orange-600'
  },
  { 
    icon: Rocket, 
    title: 'Results', 
    description: 'We focus on delivering measurable business value.',
    color: 'from-purple-500 to-pink-600'
  },
];

export default function AboutPageClient() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mission');
  const router = useRouter();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await teamApi.getAll();
        setTeamMembers(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

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
                  About{' '}
                  <span className="inline-flex items-center">
                    <KkevoLogo 
                      width={120} 
                      height={40} 
                      variant="colored"
                      className="drop-shadow-lg"
                    />
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                  We're a team of passionate technologists dedicated to building software that moves markets 
                  and transforms businesses for the digital age.
                </p>

                {/* Company Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {companyStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
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

        {/* Mission & Vision Tabs */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-16">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
                {[
                  { id: 'mission', label: 'Our Mission', icon: Target },
                  { id: 'vision', label: 'Our Vision', icon: Eye },
                  { id: 'approach', label: 'Our Approach', icon: Lightbulb }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-4xl mx-auto"
              >
                {activeTab === 'mission' && (
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                      Our Mission
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      To empower businesses with cutting-edge software solutions that drive innovation, 
                      efficiency, and growth. We believe technology should be an enabler, not a barrier.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                      {[
                        'Innovation First',
                        'Quality Assurance',
                        'Client Success'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'vision' && (
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <Eye className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                      Our Vision
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      To be the leading force in digital transformation, creating software that not only 
                      meets today's needs but anticipates tomorrow's challenges and opportunities.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                      {[
                        'Global Leadership',
                        'Technology Pioneer',
                        'Future Ready'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <Star className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'approach' && (
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <Lightbulb className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                      Our Approach
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      We combine deep technical expertise with creative problem-solving to deliver 
                      solutions that exceed expectations and drive real business value.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                      {[
                        'Agile Development',
                        'User-Centered Design',
                        'Continuous Innovation'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <Zap className="w-6 h-6 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Company Timeline */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                  Our Journey
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  From startup to industry leader, here's how we've grown and evolved over the years.
                </p>
              </div>
            </FadeInSection>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 hidden lg:block"></div>
              
              <div className="space-y-16">
                {companyTimeline.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center gap-8 ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <motion.div 
                        className="group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                          <div className="flex items-center gap-6 mb-6">
                            <div className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <span className="text-3xl">{milestone.icon}</span>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                {milestone.year}
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {milestone.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="hidden lg:block w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 z-10 shadow-lg"></div>
                    
                    <div className="flex-1"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                  Our Tech Stack
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We use cutting-edge technologies to build robust, scalable, and future-proof solutions.
                </p>
              </div>
            </FadeInSection>
            
            <StaggerList>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className="group cursor-pointer"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`bg-gradient-to-br ${tech.color} p-8 rounded-2xl shadow-xl text-center text-white group-hover:shadow-2xl transition-all duration-300`}>
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        {tech.name}
                      </h3>
                      <p className="text-sm opacity-90 font-medium">
                        {tech.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </StaggerList>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" id="team">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                  Meet Our Team
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  The brilliant minds behind every successful project and innovative solution.
                </p>
              </div>
            </FadeInSection>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <StaggerList>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      className="group"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatedCard className="h-full text-center group-hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600">
                        <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-14 h-14 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {member.name}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-6 text-lg">
                          {member.role}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                          {member.bio}
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex justify-center gap-4">
                          {Object.entries(member.social_links).map(([platform, url]) => (
                            <motion.a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-200"
                            >
                              {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                              {platform === 'github' && <Github className="w-5 h-5" />}
                              {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                              {platform === 'dribbble' && <ExternalLink className="w-5 h-5" />}
                            </motion.a>
                          ))}
                        </div>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </div>
              </StaggerList>
            )}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                  Our Values
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  The principles that guide everything we do and every decision we make.
                </p>
              </div>
            </FadeInSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
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
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Ready to Work Together?
                </h2>
                <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                  Let's discuss how our team can help bring your vision to life and transform your business.
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
                    Get in Touch
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

        <Footer />
      </main>
    </>
  );
}
