'use client';

import React from 'react';

interface KkevoLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'white' | 'colored';
}

const KkevoLogo: React.FC<KkevoLogoProps> = ({ 
  className = '', 
  width = 120, 
  height = 40,
  variant = 'default'
}) => {
  // Utility: convert hex color to rgba string
  function hexToRgba(hex: string, alpha: number): string {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized.length === 3
      ? sanitized.split('').map(ch => ch + ch).join('')
      : sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Define color schemes for different variants
  const colorSchemes = {
    default: {
      primary: '#00D4FF', // Bright cyan
      secondary: '#0066CC', // Deep blue
      text: '#1F2937', // Dark gray
      accent: '#00D4FF'
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB',
      text: '#FFFFFF',
      accent: '#00D4FF'
    },
    colored: {
      primary: '#00D4FF',
      secondary: '#0066CC',
      text: '#1F2937',
      accent: '#00D4FF'
    }
  };

  const colors = colorSchemes[variant];
  const ringSize = height * 1.68; // Reduced by 40% from 2.8
  // Position so the ring's left edge is ~30% across the logo width
  const ringCenterX = (width * 0.3) + (ringSize / 2);

  return (
    <div 
      className={`font-bold tracking-wider flex items-center justify-center ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Background circle with gradient */}
        <div 
          className="absolute rounded-full opacity-10"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            width: `${height * 0.9}px`,
            height: `${height * 0.9}px`
          }}
        />
        
        {/* Right-side large fading ring that cuts through half of the name */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            border: `2px solid ${hexToRgba(colors.primary, 0.12)}`,
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            top: '50%',
            left: `${ringCenterX}px`,
            transform: 'translate(-50%, -55%)',
            boxShadow: `0 0 ${Math.max(6, Math.round(height * 0.25))}px ${hexToRgba(colors.primary, 0.12)}`,
          }}
        />
        {/* Soft radial fade behind the ring */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(colors.primary, 0.08)} 0%, transparent 60%)`,
            width: `${ringSize * 1.1}px`,
            height: `${ringSize * 1.1}px`,
            top: '50%',
            left: `${ringCenterX}px`,
            transform: 'translate(-50%, -57%)',
            filter: 'blur(6px)'
          }}
        />
        
        {/* KKEVO text */}
        <span 
          className="relative z-10 font-black tracking-widest"
          style={{ 
            color: colors.text,
            fontSize: `${Math.max(height * 0.35, 14)}px`,
            lineHeight: 1,
            letterSpacing: '0.1em'
          }}
        >
          KKEVO
        </span>
        
        {/* Accent dot */}
        <div 
          className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
          style={{
            background: colors.accent
          }}
        />
      </div>
    </div>
  );
};

export default KkevoLogo;
