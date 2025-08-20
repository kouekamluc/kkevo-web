'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { globalCache } from './useDataCache';

interface PrefetchConfig {
  routes: string[];
  priority?: 'high' | 'medium' | 'low';
  delay?: number; // Delay before prefetching (ms)
}

export const useRoutePrefetch = (config: PrefetchConfig) => {
  const router = useRouter();
  const { routes, priority = 'medium', delay = 1000 } = config;

  const prefetchRoute = useCallback(async (route: string) => {
    // Allow disabling prefetch via env flag or global flag (useful when backend is offline)
    if (process.env.NEXT_PUBLIC_DISABLE_PREFETCH === 'true' || (typeof window !== 'undefined' && (window as any).__DISABLE_PREFETCH__)) return;

    try {
      // Prefetch the route
      await router.prefetch(route);
      
      // Also prefetch common data for that route
      await prefetchRouteData(route);
    } catch (error) {
      console.warn(`Failed to prefetch route: ${route}`, error);
    }
  }, [router]);

  const prefetchRouteData = async (route: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
    // If running without backend, short-circuit to avoid noisy network errors
    if (process.env.NEXT_PUBLIC_DISABLE_PREFETCH === 'true') return;
    
    // Check if we're in a browser environment and if the API is reachable
    if (typeof window !== 'undefined') {
      try {
        // Quick connectivity check - if this fails, skip prefetching
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const testResponse = await fetch(`${baseUrl}/healthz/`, { 
          signal: controller.signal,
          method: 'HEAD'
        });
        clearTimeout(timeoutId);
        
        if (!testResponse.ok) {
          console.warn('API health check failed, skipping prefetch');
          return;
        }
      } catch (error) {
        // API is not reachable, skip prefetching
        console.warn('API not reachable, skipping prefetch:', error);
        return;
      }
    }
    
    try {
      switch (route) {
        case '/services':
          // Prefetch services data
          if (!globalCache.has('services-list')) {
            const response = await fetch(`${baseUrl}/services/?limit=20`);
            if (response.ok) {
              const data = await response.json();
              globalCache.set('services-list', data, 10 * 60 * 1000); // 10 minutes
            }
          }
          break;

        case '/blog':
          // Prefetch blog posts
          if (!globalCache.has('blog-posts')) {
            const response = await fetch(`${baseUrl}/blog/?limit=10`);
            if (response.ok) {
              const data = await response.json();
              globalCache.set('blog-posts', data, 5 * 60 * 1000); // 5 minutes
            }
          }
          break;

        case '/work':
          // Prefetch portfolio data
          if (!globalCache.has('portfolio-list')) {
            const response = await fetch(`${baseUrl}/portfolio/?limit=12`);
            if (response.ok) {
              const data = await response.json();
              globalCache.set('portfolio-list', data, 15 * 60 * 1000); // 15 minutes
            }
          }
          break;

        case '/about':
          // Prefetch team data
          if (!globalCache.has('team-members')) {
            const response = await fetch(`${baseUrl}/team/?limit=10`);
            if (response.ok) {
              const data = await response.json();
              globalCache.set('team-members', data, 30 * 60 * 1000); // 30 minutes
            }
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.warn(`Failed to prefetch data for route: ${route}`, error);
    }
  };

  const prefetchAllRoutes = useCallback(async () => {
    const promises = routes.map(route => prefetchRoute(route));
    
    if (priority === 'high') {
      // High priority: prefetch immediately
      await Promise.all(promises);
    } else if (priority === 'medium') {
      // Medium priority: prefetch with delay
      setTimeout(async () => {
        await Promise.all(promises);
      }, delay);
    } else {
      // Low priority: prefetch when idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          await Promise.all(promises);
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          await Promise.all(promises);
        }, delay * 2);
      }
    }
  }, [routes, priority, delay, prefetchRoute]);

  // Prefetch routes when component mounts
  useEffect(() => {
    prefetchAllRoutes();
  }, [prefetchAllRoutes]);

  // Prefetch specific route on hover
  const prefetchOnHover = useCallback((route: string) => {
    prefetchRoute(route);
  }, [prefetchRoute]);

  return {
    prefetchRoute,
    prefetchAllRoutes,
    prefetchOnHover
  };
};

// Hook for prefetching on link hover
export const useLinkPrefetch = (route: string) => {
  const { prefetchOnHover } = useRoutePrefetch({ routes: [route] });
  
  const handleMouseEnter = useCallback(() => {
    prefetchOnHover(route);
  }, [prefetchOnHover, route]);

  return { handleMouseEnter };
};

// Hook for prefetching on viewport entry
export const useViewportPrefetch = (route: string, threshold = 0.1) => {
  const { prefetchRoute } = useRoutePrefetch({ routes: [route] });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchRoute(route);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe the document body to trigger prefetch when route becomes visible
    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, [prefetchRoute, route, threshold]);

  return { prefetchRoute };
};
