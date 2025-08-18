import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries[0] as PerformanceEntry;
      setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
    });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries[entries.length - 1] as PerformanceEntry;
      setMetrics(prev => ({ ...prev, lcp: lcp.startTime }));
    });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fid = entries[0] as PerformanceEntry & { processingStart?: number };
      if (fid.processingStart) {
        const processingStart = fid.processingStart;
        setMetrics(prev => ({ ...prev, fid: processingStart - fid.startTime }));
      }
    });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
          clsValue += layoutShiftEntry.value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  const getLighthouseScore = (metric: keyof PerformanceMetrics): number => {
    const value = metrics[metric];
    if (value === null) return 0;

    switch (metric) {
      case 'fcp':
        return value < 1800 ? 100 : value < 3000 ? 75 : value < 4000 ? 50 : 25;
      case 'lcp':
        return value < 2500 ? 100 : value < 4000 ? 75 : value < 6000 ? 50 : 25;
      case 'fid':
        return value < 100 ? 100 : value < 300 ? 75 : value < 500 ? 50 : 25;
      case 'cls':
        return value < 0.1 ? 100 : value < 0.25 ? 75 : value < 0.4 ? 50 : 25;
      case 'ttfb':
        return value < 800 ? 100 : value < 1800 ? 75 : value < 3000 ? 50 : 25;
      default:
        return 0;
    }
  };

  const getOverallScore = (): number => {
    const scores = Object.keys(metrics).map(key => getLighthouseScore(key as keyof PerformanceMetrics));
    const validScores = scores.filter(score => score > 0);
    return validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  };

  return {
    metrics,
    getLighthouseScore,
    getOverallScore,
  };
};
