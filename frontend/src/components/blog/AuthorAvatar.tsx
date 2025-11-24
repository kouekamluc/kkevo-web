'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface AuthorAvatarProps {
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRole?: boolean;
  showName?: boolean;
  className?: string;
  onClick?: () => void;
}

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({
  author,
  size = 'md',
  showRole = true,
  showName = true,
  className = '',
  onClick
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-xs';
      case 'md': return 'w-10 h-10 text-sm';
      case 'lg': return 'w-12 h-12 text-base';
      case 'xl': return 'w-16 h-16 text-lg';
      default: return 'w-10 h-10 text-sm';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'md': return 'text-sm';
      case 'lg': return 'text-base';
      case 'xl': return 'text-lg';
      default: return 'text-sm';
    }
  };

  const getRoleSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'md': return 'text-xs';
      case 'lg': return 'text-sm';
      case 'xl': return 'text-base';
      default: return 'text-xs';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'ceo': 'CEO & Founder',
      'cto': 'CTO',
      'developer': 'Lead Developer',
      'designer': 'UI/UX Designer',
      'devops': 'DevOps Engineer',
      'pm': 'Product Manager',
      'qa': 'QA Engineer',
      'intern': 'Intern'
    };
    return roleMap[role.toLowerCase()] || role.replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-3 ${className}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {author.avatar ? (
          <motion.img
            src={author.avatar}
            alt={author.name}
            className={`${getSizeClasses()} rounded-full object-cover border-2 border-white/20`}
            whileHover={{ borderColor: 'rgba(99, 102, 241, 0.5)' }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.div
            className={`${getSizeClasses()} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium border-2 border-white/20`}
            whileHover={{ 
              borderColor: 'rgba(99, 102, 241, 0.5)',
              scale: 1.05 
            }}
            transition={{ duration: 0.2 }}
          >
            {getInitials(author.name)}
          </motion.div>
        )}
      </div>

      {/* Author Info */}
      {showName && (
        <div className="min-w-0 flex-1">
          <p className={`font-medium text-white truncate ${getTextSizeClasses()}`}>
            {author.name}
          </p>
          {showRole && author.role && (
            <p className={`text-gray-400 truncate ${getRoleSizeClasses()}`}>
              {getRoleDisplayName(author.role)}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AuthorAvatar;







