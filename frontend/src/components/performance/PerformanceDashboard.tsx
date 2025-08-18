'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, Target } from 'lucide-react';
import { usePerformance } from '@/hooks/usePerformance';

const PerformanceDashboard = () => {
  const { metrics, getLighthouseScore, getOverallScore } = usePerformance();
  const [isExpanded, setIsExpanded] = useState(false);

  const overallScore = getOverallScore();
  const scoreColor = overallScore >= 90 ? 'text-green-500' : overallScore >= 75 ? 'text-yellow-500' : 'text-red-500';

  const metricLabels = {
    fcp: 'First Contentful Paint',
    lcp: 'Largest Contentful Paint',
    fid: 'First Input Delay',
    cls: 'Cumulative Layout Shift',
    ttfb: 'Time to First Byte',
  };

  const metricIcons = {
    fcp: Activity,
    lcp: Target,
    fid: Zap,
    cls: TrendingDown,
    ttfb: Clock,
  };

  const formatMetric = (key: string, value: number | null): string => {
    if (value === null) return 'N/A';
    
    switch (key) {
      case 'fcp':
      case 'lcp':
      case 'fid':
      case 'ttfb':
        return `${Math.round(value)}ms`;
      case 'cls':
        return value.toFixed(3);
      default:
        return value.toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${scoreColor} bg-current`}></div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Performance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${scoreColor}`}>
                {overallScore}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-4">
              {Object.entries(metrics).map(([key, value]) => {
                const Icon = metricIcons[key as keyof typeof metricIcons];
                const score = getLighthouseScore(key as keyof typeof metrics);
                const scoreColor = score >= 90 ? 'text-green-500' : score >= 75 ? 'text-yellow-500' : 'text-red-500';
                
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {metricLabels[key as keyof typeof metricLabels]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {formatMetric(key, value)}
                      </span>
                      <span className={`text-sm font-semibold ${scoreColor}`}>
                        {score}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Performance Tips */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Performance Tips
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {overallScore < 90 && (
                    <>
                      <li>• Optimize images and use WebP format</li>
                      <li>• Implement code splitting and lazy loading</li>
                      <li>• Minimize bundle size and remove unused code</li>
                      <li>• Use CDN for static assets</li>
                    </>
                  )}
                  {overallScore >= 90 && (
                    <li className="text-green-600 dark:text-green-400">
                      • Excellent performance! Keep up the good work
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PerformanceDashboard;
