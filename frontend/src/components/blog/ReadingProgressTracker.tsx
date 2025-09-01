'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { blogApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface ReadingProgressTrackerProps {
  postId: string;
  postTitle: string;
  estimatedReadingTime: number;
  onProgressUpdate?: (progress: number) => void;
}

const ReadingProgressTracker: React.FC<ReadingProgressTrackerProps> = ({
  postId,
  postTitle,
  estimatedReadingTime,
  onProgressUpdate
}) => {
  const { isAuthenticated, user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  
  const startTimeRef = useRef<number>(Date.now());
  const lastScrollPositionRef = useRef<number>(0);
  const saveIntervalRef = useRef<NodeJS.Timeout>();
  const progressUpdateIntervalRef = useRef<NodeJS.Timeout>();

  // Calculate reading progress based on scroll position
  const calculateProgress = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
    
    return Math.round(currentProgress);
  }, []);

  // Update progress based on scroll position
  const updateProgress = useCallback(() => {
    const currentProgress = calculateProgress();
    setProgress(currentProgress);
    
    // Mark as completed if progress is over 90%
    if (currentProgress >= 90 && !isCompleted) {
      setIsCompleted(true);
      toast.success('Great job! You\'ve completed reading this article.');
    }
    
    onProgressUpdate?.(currentProgress);
  }, [calculateProgress, isCompleted, onProgressUpdate]);

  // Save progress to backend
  const saveProgress = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      await blogApi.updateReadingProgress(postId, {
        progress_percentage: progress,
        time_spent: timeSpent,
        last_position: progress,
        is_completed: isCompleted
      });
      
      setLastSaveTime(Date.now());
    } catch (error) {
      console.error('Error saving reading progress:', error);
      // Don't show error toast for progress saves to avoid spam
    }
  }, [isAuthenticated, user, postId, progress, timeSpent, isCompleted]);

  // Start tracking reading progress
  const startTracking = useCallback(() => {
    if (!isAuthenticated) return;
    
    setIsTracking(true);
    startTimeRef.current = Date.now();
    
    // Update progress every 500ms
    progressUpdateIntervalRef.current = setInterval(updateProgress, 500);
    
    // Save progress every 30 seconds
    saveIntervalRef.current = setInterval(saveProgress, 30000);
    
    // Initial save
    saveProgress();
  }, [isAuthenticated, updateProgress, saveProgress]);

  // Stop tracking reading progress
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    
    if (progressUpdateIntervalRef.current) {
      clearInterval(progressUpdateIntervalRef.current);
    }
    
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
    
    // Final save
    saveProgress();
  }, [saveProgress]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!isTracking) return;
    
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = Math.abs(currentScrollPosition - lastScrollPositionRef.current);
    
    // Only update if there's significant scroll movement
    if (scrollDelta > 50) {
      updateProgress();
      lastScrollPositionRef.current = currentScrollPosition;
    }
  }, [isTracking, updateProgress]);

  // Handle visibility change (tab switching, minimizing)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // User switched tabs or minimized - pause tracking
      if (isTracking) {
        stopTracking();
      }
    } else {
      // User returned to tab - resume tracking
      if (isAuthenticated && !isTracking) {
        startTracking();
      }
    }
  }, [isAuthenticated, isTracking, startTracking, stopTracking]);

  // Handle beforeunload (page refresh/close)
  const handleBeforeUnload = useCallback(() => {
    if (isTracking) {
      saveProgress();
    }
  }, [isTracking, saveProgress]);

  // Start tracking when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      startTracking();
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      // Cleanup
      stopTracking();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated, startTracking, stopTracking, handleScroll, handleVisibilityChange, handleBeforeUnload]);

  // Update time spent
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
      setTimeSpent(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTracking]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Calculate reading speed
  const readingSpeed = timeSpent > 0 ? Math.round((progress / 100) * estimatedReadingTime * 60 / timeSpent) : 0;

  // Get progress color based on completion
  const getProgressColor = () => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Log in to track your reading progress
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Reading Progress</span>
        </h3>
        
        {isTracking && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Tracking</span>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getProgressColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600">Time Spent</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatTime(timeSpent)}
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Eye className="w-5 h-5 text-gray-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600">Reading Speed</div>
          <div className="text-lg font-semibold text-gray-900">
            {readingSpeed} wpm
          </div>
        </div>
      </div>
      
      {/* Completion Status */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Article completed! Great job!
          </span>
        </motion.div>
      )}
      
      {/* Last Save Indicator */}
      {lastSaveTime > 0 && (
        <div className="text-xs text-gray-500 text-center mt-3">
          Progress saved {formatTime(Math.floor((Date.now() - lastSaveTime) / 1000))} ago
        </div>
      )}
      
      {/* Estimated Completion */}
      {progress > 0 && progress < 90 && (
        <div className="text-xs text-gray-500 text-center mt-2">
          {readingSpeed > 0 && (
            <span>
              Estimated completion: {Math.round((estimatedReadingTime * 60 - timeSpent) / 60)} minutes remaining
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingProgressTracker;


