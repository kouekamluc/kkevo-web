'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, Calendar, User, Tag, 
  Filter, Search, MoreVertical, Settings, BarChart3,
  FileText, FolderOpen, TrendingUp, Users, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedCard, AnimatedButton, Skeleton } from '@/components/ui';
import { BlogPost, BlogCategory } from '@/types';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalCategories: number;
}

export default function AdminBlogDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const [postsResponse, categoriesResponse] = await Promise.all([
          blogApi.getAll({ page: 1, page_size: 50 }),
          blogApi.getCategories()
        ]);
        
        const allPosts: BlogPost[] = postsResponse.data.results || postsResponse.data || [];
        const allCategories: BlogCategory[] = categoriesResponse.data.results || categoriesResponse.data || [];
        
        setPosts(allPosts);
        setCategories(allCategories);
        
        // Calculate stats
        const publishedPosts = allPosts.filter(post => post.status === 'published').length;
        const draftPosts = allPosts.filter(post => post.status === 'draft').length;
        const totalViews = allPosts.reduce((sum, post) => sum + (post.view_count || 0), 0);
        const totalLikes = allPosts.reduce((sum, post) => sum + (post.like_count || 0), 0);
        
        setStats({
          totalPosts: allPosts.length,
          publishedPosts,
          draftPosts,
          totalViews,
          totalLikes,
          totalCategories: allCategories.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || 
                           (post.category && post.category.slug === categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle post actions
  const handleViewPost = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const handleEditPost = (id: string) => {
    router.push(`/admin/blog/${id}/edit`);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await blogApi.delete(id);
        setPosts(posts.filter(post => post.id !== id));
        // Update stats
        setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await blogApi.update(post.id, { status: newStatus });
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, status: newStatus } : p
      ));
      // Update stats
      if (newStatus === 'published') {
        setStats(prev => ({ 
          ...prev, 
          publishedPosts: prev.publishedPosts + 1,
          draftPosts: prev.draftPosts - 1
        }));
      } else {
        setStats(prev => ({ 
          ...prev, 
          publishedPosts: prev.publishedPosts - 1,
          draftPosts: prev.draftPosts + 1
        }));
      }
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your blog posts, categories, and content
            </p>
          </div>
          <div className="flex space-x-3">
            <AnimatedButton
              onClick={() => router.push('/admin/blog/new')}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </AnimatedButton>
            <AnimatedButton
              onClick={() => router.push('/admin/blog/categories')}
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Categories
            </AnimatedButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Posts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalPosts}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.publishedPosts}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Drafts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.draftPosts}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters and Search */}
        <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Posts Table */}
        <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Blog Posts ({filteredPosts.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Post
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Author
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Stats
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {post.author.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {post.category ? (
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                          >
                            {post.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No category</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : post.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {post.view_count || 0}
                            </span>
                            <span className="flex items-center">
                              <Tag className="w-3 h-3 mr-1" />
                              {post.like_count || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <AnimatedButton
                            onClick={() => handleViewPost(post.slug)}
                            size="sm"
                            variant="outline"
                            className="p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => handleEditPost(post.id)}
                            size="sm"
                            variant="outline"
                            className="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => handleToggleStatus(post)}
                            size="sm"
                            variant="outline"
                            className={`p-2 ${
                              post.status === 'published' 
                                ? 'text-yellow-600 border-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 border-green-600 hover:bg-green-50'
                            }`}
                          >
                            {post.status === 'published' ? <Clock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => handleDeletePost(post.id)}
                            size="sm"
                            variant="outline"
                            className="p-2 text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try adjusting your filters or search terms.'
                      : 'Get started by creating your first blog post.'}
                  </p>
                  {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                    <AnimatedButton
                      onClick={() => router.push('/admin/blog/new')}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </AnimatedButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}







