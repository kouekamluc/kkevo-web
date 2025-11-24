'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  FileText, 
  MessageSquare, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { blogApi, servicesApi, contactApi } from '@/lib/api';

interface AnalyticsData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalContacts: number;
  totalServices: number;
  monthlyViews: { month: string; views: number }[];
  topPosts: { title: string; views: number }[];
  categoryDistribution: { category: string; count: number }[];
  engagementRate: number;
  averageReadingTime: number;
}

export default function AnalyticsDashboard() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch data from various APIs
      const [postsResponse, servicesResponse, contactsResponse] = await Promise.allSettled([
        blogApi.getAll({ published_only: false, limit: 1000 }),
        servicesApi.getAll(),
        contactApi.getAll()
      ]);

      const posts = postsResponse.status === 'fulfilled' 
        ? (postsResponse.value.data?.results || postsResponse.value.data || [])
        : [];
      
      const services = servicesResponse.status === 'fulfilled'
        ? (servicesResponse.value.data?.results || servicesResponse.value.data || [])
        : [];
      
      const contacts = contactsResponse.status === 'fulfilled'
        ? (contactsResponse.value.data?.results || contactsResponse.value.data || [])
        : [];

      // Calculate analytics
      const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
      const totalLikes = posts.reduce((sum, post) => sum + (post.like_count || 0), 0);
      const publishedPosts = posts.filter(post => post.status === 'published').length;
      const draftPosts = posts.filter(post => post.status === 'draft').length;

      // Generate mock monthly data (in real app, this would come from analytics API)
      const monthlyViews = generateMonthlyData(totalViews, timeRange);
      
      // Top performing posts
      const topPosts = posts
        .filter(post => post.status === 'published')
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(post => ({
          title: post.title,
          views: post.view_count || 0
        }));

      // Category distribution
      const categoryCounts: { [key: string]: number } = {};
      posts.forEach(post => {
        const category = post.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count
      }));

      // Calculate engagement rate
      const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100) : 0;
      
      // Average reading time
      const totalReadingTime = posts.reduce((sum, post) => sum + (post.estimated_reading_time || 5), 0);
      const averageReadingTime = posts.length > 0 ? Math.round(totalReadingTime / posts.length) : 0;

      setAnalytics({
        totalPosts: posts.length,
        publishedPosts,
        draftPosts,
        totalViews,
        totalLikes,
        totalContacts: contacts.length,
        totalServices: services.length,
        monthlyViews,
        topPosts,
        categoryDistribution,
        engagementRate,
        averageReadingTime
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (totalViews: number, range: string) => {
    const months = [];
    const now = new Date();
    let count = 0;
    
    switch (range) {
      case '7d':
        count = 7;
        break;
      case '30d':
        count = 30;
        break;
      case '90d':
        count = 3;
        break;
      case '1y':
        count = 12;
        break;
    }

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now);
      if (range === '7d' || range === '30d') {
        date.setDate(date.getDate() - i);
        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: Math.floor(Math.random() * (totalViews / count) * 2)
        });
      } else {
        date.setMonth(date.getMonth() - i);
        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          views: Math.floor(Math.random() * (totalViews / count) * 2)
        });
      }
    }
    
    return months;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access the analytics dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Admin privileges required to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor your website performance and user engagement
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex space-x-2">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '3 Months' : '1 Year'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <AnimatedCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.totalPosts}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {analytics.publishedPosts} published, {analytics.draftPosts} drafts
                    </p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {analytics.totalLikes} likes
                    </p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.engagementRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {analytics.averageReadingTime} min avg read time
                    </p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contacts</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.totalContacts}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {analytics.totalServices} services
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Views Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Views Trend</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.monthlyViews.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${(data.views / Math.max(...analytics.monthlyViews.map(d => d.views))) * 200 }px` }}></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Category Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Distribution</h3>
                <div className="space-y-3">
                  {analytics.categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(category.count / analytics.totalPosts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Top Performing Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Performing Posts</h3>
              <div className="space-y-4">
                {analytics.topPosts.map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        #{index + 1}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">{post.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{post.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <AnimatedCard className="p-6 text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Content Strategy</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Focus on {analytics.categoryDistribution[0]?.category || 'Technology'} content for better engagement
                </p>
              </AnimatedCard>

              <AnimatedCard className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Growth Opportunity</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {analytics.draftPosts} drafts ready for publication
                </p>
              </AnimatedCard>

              <AnimatedCard className="p-6 text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Performance</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {analytics.engagementRate > 5 ? 'Excellent' : analytics.engagementRate > 2 ? 'Good' : 'Needs improvement'} engagement rate
                </p>
              </AnimatedCard>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start creating content to see analytics data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



