'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { getSafeImageUrl } from '@/lib/imageUtils';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | undefined | null;
  fallbackWidth?: number;
  fallbackHeight?: number;
}

/**
 * SafeImage component that validates image URLs before rendering
 * and provides fallbacks for invalid URLs
 */
const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackWidth = 400,
  fallbackHeight = 300,
  alt,
  ...props
}) => {
  const safeImageUrl = getSafeImageUrl(src, fallbackWidth, fallbackHeight);
  
  return (
    <Image
      {...props}
      src={safeImageUrl}
      alt={alt}
    />
  );
};

export default SafeImage;



