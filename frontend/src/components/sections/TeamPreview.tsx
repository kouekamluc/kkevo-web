'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { TeamMember } from '@/types';

interface TeamPreviewProps {
  teamMembers?: TeamMember[];
}

const TeamPreview = ({ teamMembers = [] }: TeamPreviewProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fallback team members if no live data
  const fallbackTeam = [
    {
      id: '1',
      name: 'Alex Chen',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in software development.',
      avatar: '/api/placeholder/150/150',
      social_links: {
        linkedin: 'https://linkedin.com/in/alexchen',
        github: 'https://github.com/alexchen',
        twitter: 'https://twitter.com/alexchen'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Technical architect and engineering leader.',
      avatar: '/api/placeholder/150/150',
      social_links: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahjohnson'
      }
    },
    {
      id: '3',
      name: 'Marcus Rodriguez',
      role: 'Lead Developer',
      bio: 'Full-stack developer specializing in modern technologies.',
      avatar: '/api/placeholder/150/150',
      social_links: {
        linkedin: 'https://linkedin.com/in/marcusrodriguez',
        github: 'https://github.com/marcusrodriguez'
      }
    }
  ];

  const displayTeam = teamMembers.length > 0 ? teamMembers : fallbackTeam;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return Linkedin;
      case 'github':
        return Github;
      case 'twitter':
        return Twitter;
      default:
        return ExternalLink;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Meet Our Leadership Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Our experienced team of technologists and business leaders drive innovation and deliver exceptional results
          </motion.p>
        </div>

        {/* Team Grid */}
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayTeam.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 text-center relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Avatar */}
                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 text-white text-2xl font-bold overflow-hidden">
                    {member.avatar ? (
                      <Image 
                        src={member.avatar} 
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                </div>

                {/* Member Info */}
                <div className="relative z-10 mb-6">
                  <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Social Links */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3">
                    {Object.entries(member.social_links || {}).map(([platform, url]) => {
                      const Icon = getSocialIcon(platform);
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group-hover:scale-110"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Hover effect indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Want to learn more about our team and culture?
          </p>
          <a
            href="/about"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Meet the Full Team
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamPreview;
