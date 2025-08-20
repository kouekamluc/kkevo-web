'use client';

import { useRoutePrefetch } from '@/hooks';

// Prefetch common routes for better performance
const RoutePrefetcher = () => {
  useRoutePrefetch({
    routes: ['/services', '/blog', '/work', '/about', '/contact'],
    priority: 'medium',
    delay: 2000 // Start prefetching after 2 seconds
  });
  
  return null;
};

export default RoutePrefetcher;
