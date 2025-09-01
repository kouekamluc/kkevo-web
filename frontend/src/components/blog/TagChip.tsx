'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TagChipProps {
  tag: string;
  variant?: 'default' | 'removable' | 'selectable';
  selected?: boolean;
  onClick?: (tag: string) => void;
  onRemove?: (tag: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TagChip: React.FC<TagChipProps> = ({
  tag,
  variant = 'default',
  selected = false,
  onClick,
  onRemove,
  className = '',
  size = 'md'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'md': return 'px-3 py-1.5 text-sm';
      case 'lg': return 'px-4 py-2 text-base';
      default: return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'removable':
        return 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30';
      case 'selectable':
        return selected 
          ? 'bg-indigo-500 text-white border border-indigo-500' 
          : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20';
      default:
        return 'bg-white/10 text-gray-300 border border-white/20';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${className}
      `}
      onClick={handleClick}
    >
      <span>{tag}</span>
      
      {variant === 'removable' && onRemove && (
        <button
          onClick={handleRemove}
          className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
          title="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      {variant === 'selectable' && selected && (
        <div className="w-2 h-2 bg-white rounded-full"></div>
      )}
    </motion.div>
  );
};

export default TagChip;






