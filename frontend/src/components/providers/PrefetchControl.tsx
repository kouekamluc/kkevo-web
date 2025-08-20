'use client';

import { useEffect } from 'react';
import { config, isBackendReachable, disablePrefetch } from '@/lib/config';

const PrefetchControl = () => {
  useEffect(() => {
    // Check if API is reachable
    const checkBackend = async () => {
      const isReachable = await isBackendReachable();
      if (!isReachable) {
        console.warn('API not reachable, disabling prefetch');
        disablePrefetch();
      }
    };

    checkBackend();
    
    // Add manual control for developers
    (window as any).disablePrefetch = () => {
      disablePrefetch();
      console.log('Prefetching manually disabled. Run window.enablePrefetch() to re-enable.');
    };
    (window as any).enablePrefetch = () => {
      (window as any).__DISABLE_PREFETCH__ = false;
      console.log('Prefetching re-enabled.');
    };
  }, []);

  return null;
};

export default PrefetchControl;
