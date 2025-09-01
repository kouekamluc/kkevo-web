'use client';

import { useEffect, useState } from 'react';

const PrefetchControl = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if API is reachable
    const checkApiHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Use the correct backend API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
        const response = await fetch(`${apiUrl}/healthz/`, {
          signal: controller.signal,
          method: 'GET',
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // API is reachable, enable prefetching
          (window as any).__DISABLE_PREFETCH__ = false;
          console.log('✅ API is reachable, prefetching enabled');
        } else {
          // API responded but with error, disable prefetching
          (window as any).__DISABLE_PREFETCH__ = true;
          console.warn('⚠️ API responded with error, prefetching disabled');
        }
      } catch (error) {
        // API is not reachable, disable prefetching
        (window as any).__DISABLE_PREFETCH__ = true;
        console.warn('🚫 API not reachable, prefetching disabled');
      }
    };

    // Check immediately
    checkApiHealth();

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, [isClient]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  return null;
};

export default PrefetchControl;
