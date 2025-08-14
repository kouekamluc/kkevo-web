'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
  scale?: boolean;
  opacity?: boolean;
}

const ParallaxImage = ({
  src,
  alt,
  className = '',
  speed = 0.5,
  direction = 'down',
  scale = false,
  opacity = false,
}: ParallaxImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'down' ? [0, -100 * speed] : [100 * speed, 0]
  );

  const scaleTransform = useTransform(
    scrollYProgress,
    [0, 1],
    scale ? [1, 1.1] : [1, 1]
  );

  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    opacity ? [0.3, 1, 0.3] : [1, 1, 1]
  );

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // GSAP ScrollTrigger for additional effects
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    if (scale) {
      tl.to(image, {
        scale: 1.1,
        ease: 'none',
      });
    }

    return () => {
      tl.kill();
    };
  }, [scale]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          y,
          scale: scaleTransform,
          opacity: opacityTransform,
        }}
      />
    </div>
  );
};

export default ParallaxImage;
