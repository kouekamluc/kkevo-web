'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Users, Award, CheckCircle, Globe, Rocket, Zap } from 'lucide-react';
import { teamApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  },
  {
    year: '2020',
    title: 'First Major Client',
    description: 'Successfully delivered our first enterprise-level project, establishing our reputation for quality.',
    icon: '🎯',
  },
  {
    year: '2021',
    title: 'Team Expansion',
    description: 'Grew our team to 15+ developers and designers, expanding our service offerings.',
    icon: '👥',
  },
  {
    year: '2022',
    title: 'AI & ML Division',
    description: 'Launched our artificial intelligence and machine learning services division.',
    icon: '🤖',
  },
  {
    year: '2023',
    title: 'Global Recognition',
    description: 'Received industry awards and expanded our client base to international markets.',
    icon: '🌍',
  },
  {
    year: '2024',
    title: 'Future Forward',
    description: 'Continuing to innovate and lead in emerging technologies and digital transformation.',
    icon: '🔮',
  },
];

const techStack = [
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Python', icon: '🐍', category: 'Backend' },
  { name: 'Django', icon: '🎯', category: 'Framework' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'TensorFlow', icon: '🧠', category: 'AI/ML' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'TypeScript', icon: '📘', category: 'Language' },
  { name: 'Next.js', icon: '⚡', category: 'Framework' },
  { name: 'Kubernetes', icon: '☸️', category: 'DevOps' },
  { name: 'GraphQL', icon: '🔷', category: 'API' },
];



export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  About KKEVO
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We're a team of passionate technologists dedicated to building software that moves markets 
                  and transforms businesses for the digital age.
                </p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeInSection>
                <div className="text-center lg:text-left">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <ArrowRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    To empower businesses with cutting-edge software solutions that drive innovation, 
                    efficiency, and growth. We believe technology should be an enabler, not a barrier.
                  </p>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <div className="text-center lg:text-left">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Vision
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    To be the leading force in digital transformation, creating software that not only 
                    meets today's needs but anticipates tomorrow's challenges and opportunities.
                  </p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Company Timeline */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Journey
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  From startup to industry leader, here's how we've grown and evolved over the years.
                </p>
              </div>
            </FadeInSection>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-indigo-200 dark:bg-indigo-800 hidden lg:block"></div>
              
              <div className="space-y-12">
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
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                            <span className="text-2xl">{milestone.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {milestone.year}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {milestone.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
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

        {/* Tech Stack */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Tech Stack
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We use cutting-edge technologies to build robust, scalable, and future-proof solutions.
                </p>
              </div>
            </FadeInSection>
            
            <StaggerList>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl mb-3">{tech.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {tech.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
        <section className="py-16 bg-gray-50 dark:bg-gray-900" id="team">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
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
                    >
                      <AnimatedCard className="h-full text-center group-hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Users className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {member.name}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                          {member.role}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {member.bio}
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex justify-center gap-3">
                          {Object.entries(member.social_links).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                            >
                              {platform === 'linkedin' && '🔗'}
                              {platform === 'github' && '🐙'}
                              {platform === 'twitter' && '🐦'}
                              {platform === 'dribbble' && '🏀'}
                            </a>
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Values
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  The principles that guide everything we do and every decision we make.
                </p>
              </div>
            </FadeInSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '🎯', title: 'Excellence', description: 'We strive for excellence in every project, no matter the size.' },
                { icon: '🤝', title: 'Collaboration', description: 'We believe the best solutions come from working together.' },
                { icon: '💡', title: 'Innovation', description: 'We constantly explore new technologies and approaches.' },
                { icon: '🚀', title: 'Results', description: 'We focus on delivering measurable business value.' },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Work Together?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Let's discuss how our team can help bring your vision to life.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get in Touch
              </button>
            </FadeInSection>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
