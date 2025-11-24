/**
 * Blog API Service - Comprehensive API layer for blog operations
 */
import axios, { AxiosResponse } from 'axios';
import {
  BlogPostList,
  BlogPostDetail,
  BlogCategory,
  BlogTag,
  BlogPostLike,
  BlogPostBookmark,
  BlogPostShare,
  BlogPostComment,
  UserReadingProgressModel,
  BlogInteractionRequest,
  ReadingProgressRequest,
  BlogSearchRequest,
  PaginatedResponse,
  BlogInteractionResponse,
  ReadingProgressResponse,
  BlogDashboard,
  ReadingAnalytics,
  BlogAnalytics,
  PostAnalytics,
  BlogPostForm,
  CommentForm,
  BlogFilters,
  BlogSortOptions
} from '../models/BlogModels';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
const BLOG_API_URL = `${API_BASE_URL}/blog`;

// Axios instance with default configuration
const blogApi = axios.create({
  baseURL: BLOG_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
blogApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
blogApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Blog Posts API
export class BlogPostApi {
  /**
   * Get paginated list of blog posts
   */
  static async getPosts(
    filters?: BlogFilters,
    sort?: BlogSortOptions,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<BlogPostList>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    if (sort) {
      params.append('ordering', sort.direction === 'desc' ? `-${sort.field}` : sort.field);
    }
    
    params.append('page', page.toString());
    params.append('page_size', limit.toString());
    
    const response: AxiosResponse<PaginatedResponse<BlogPostList>> = await blogApi.get(
      `/posts/?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get a single blog post by slug
   */
  static async getPost(slug: string): Promise<BlogPostDetail> {
    const response: AxiosResponse<BlogPostDetail> = await blogApi.get(`/posts/${slug}/`);
    return response.data;
  }

  /**
   * Create a new blog post
   */
  static async createPost(postData: BlogPostForm): Promise<BlogPostDetail> {
    const response: AxiosResponse<BlogPostDetail> = await blogApi.post('/posts/', postData);
    return response.data;
  }

  /**
   * Update a blog post
   */
  static async updatePost(slug: string, postData: Partial<BlogPostForm>): Promise<BlogPostDetail> {
    const response: AxiosResponse<BlogPostDetail> = await blogApi.patch(`/posts/${slug}/`, postData);
    return response.data;
  }

  /**
   * Delete a blog post
   */
  static async deletePost(slug: string): Promise<void> {
    await blogApi.delete(`/posts/${slug}/`);
  }

  /**
   * Get featured posts
   */
  static async getFeaturedPosts(): Promise<BlogPostList[]> {
    const response: AxiosResponse<BlogPostList[]> = await blogApi.get('/posts/featured/');
    return response.data;
  }

  /**
   * Get popular posts
   */
  static async getPopularPosts(): Promise<BlogPostList[]> {
    const response: AxiosResponse<BlogPostList[]> = await blogApi.get('/posts/popular/');
    return response.data;
  }

  /**
   * Get recent posts
   */
  static async getRecentPosts(): Promise<BlogPostList[]> {
    const response: AxiosResponse<BlogPostList[]> = await blogApi.get('/posts/recent/');
    return response.data;
  }

  /**
   * Search blog posts
   */
  static async searchPosts(searchRequest: BlogSearchRequest): Promise<PaginatedResponse<BlogPostList>> {
    const params = new URLSearchParams();
    params.append('q', searchRequest.q);
    
    if (searchRequest.category) params.append('category', searchRequest.category);
    if (searchRequest.tags) params.append('tags', searchRequest.tags.join(','));
    if (searchRequest.limit) params.append('limit', searchRequest.limit.toString());
    if (searchRequest.offset) params.append('offset', searchRequest.offset.toString());
    
    const response: AxiosResponse<PaginatedResponse<BlogPostList>> = await blogApi.get(
      `/posts/search/?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get dashboard data
   */
  static async getDashboard(): Promise<BlogDashboard> {
    const response: AxiosResponse<BlogDashboard> = await blogApi.get('/posts/dashboard/');
    return response.data;
  }
}

// Blog Interactions API
export class BlogInteractionApi {
  /**
   * Like or unlike a blog post
   */
  static async likePost(slug: string, action: 'like' | 'unlike'): Promise<BlogInteractionResponse> {
    const response: AxiosResponse<BlogInteractionResponse> = await blogApi.post(
      `/posts/${slug}/like/`,
      { action }
    );
    return response.data;
  }

  /**
   * Bookmark or unbookmark a blog post
   */
  static async bookmarkPost(slug: string, action: 'bookmark' | 'unbookmark'): Promise<BlogInteractionResponse> {
    const response: AxiosResponse<BlogInteractionResponse> = await blogApi.post(
      `/posts/${slug}/bookmark/`,
      { action }
    );
    return response.data;
  }

  /**
   * Share a blog post
   */
  static async sharePost(slug: string, platform: string): Promise<BlogInteractionResponse> {
    const response: AxiosResponse<BlogInteractionResponse> = await blogApi.post(
      `/posts/${slug}/share/`,
      { action: 'share', platform }
    );
    return response.data;
  }

  /**
   * Get user's interactions
   */
  static async getUserInteractions(): Promise<{ liked_posts: string[]; bookmarked_posts: string[] }> {
    const response = await blogApi.get('/posts/dashboard/');
    return response.data.interactions;
  }
}

// Reading Progress API
export class ReadingProgressApi {
  /**
   * Update reading progress
   */
  static async updateProgress(progressData: ReadingProgressRequest): Promise<ReadingProgressResponse> {
    const response: AxiosResponse<ReadingProgressResponse> = await blogApi.post(
      '/reading-progress/',
      progressData
    );
    return response.data;
  }

  /**
   * Get user's reading progress
   */
  static async getUserProgress(): Promise<UserReadingProgressModel[]> {
    const response: AxiosResponse<UserReadingProgressModel[]> = await blogApi.get('/reading-progress/');
    return response.data;
  }

  /**
   * Get reading analytics
   */
  static async getReadingAnalytics(): Promise<ReadingAnalytics> {
    const response: AxiosResponse<ReadingAnalytics> = await blogApi.get('/reading-progress/analytics/');
    return response.data;
  }
}

// Comments API
export class CommentApi {
  /**
   * Get comments for a blog post
   */
  static async getComments(postSlug: string): Promise<BlogPostComment[]> {
    const response: AxiosResponse<BlogPostComment[]> = await blogApi.get(
      `/comments/?post__slug=${postSlug}`
    );
    return response.data;
  }

  /**
   * Create a new comment
   */
  static async createComment(commentData: CommentForm & { post: string }): Promise<BlogPostComment> {
    const response: AxiosResponse<BlogPostComment> = await blogApi.post('/comments/', commentData);
    return response.data;
  }

  /**
   * Update a comment
   */
  static async updateComment(commentId: string, commentData: Partial<CommentForm>): Promise<BlogPostComment> {
    const response: AxiosResponse<BlogPostComment> = await blogApi.patch(`/comments/${commentId}/`, commentData);
    return response.data;
  }

  /**
   * Delete a comment
   */
  static async deleteComment(commentId: string): Promise<void> {
    await blogApi.delete(`/comments/${commentId}/`);
  }

  /**
   * Moderate a comment (staff only)
   */
  static async moderateComment(commentId: string, isApproved: boolean, notes?: string): Promise<void> {
    await blogApi.post(`/comments/${commentId}/moderate/`, {
      is_approved: isApproved,
      moderation_notes: notes || ''
    });
  }
}

// Categories API
export class CategoryApi {
  /**
   * Get all categories
   */
  static async getCategories(): Promise<BlogCategory[]> {
    const response: AxiosResponse<BlogCategory[]> = await blogApi.get('/categories/');
    return response.data;
  }

  /**
   * Get posts for a category
   */
  static async getCategoryPosts(slug: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<BlogPostList>> {
    const response: AxiosResponse<PaginatedResponse<BlogPostList>> = await blogApi.get(
      `/categories/${slug}/posts/?page=${page}&page_size=${limit}`
    );
    return response.data;
  }
}

// Tags API
export class TagApi {
  /**
   * Get all tags
   */
  static async getTags(): Promise<BlogTag[]> {
    const response: AxiosResponse<BlogTag[]> = await blogApi.get('/tags/');
    return response.data;
  }

  /**
   * Get posts for a tag
   */
  static async getTagPosts(slug: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<BlogPostList>> {
    const response: AxiosResponse<PaginatedResponse<BlogPostList>> = await blogApi.get(
      `/tags/${slug}/posts/?page=${page}&page_size=${limit}`
    );
    return response.data;
  }
}

// Analytics API
export class AnalyticsApi {
  /**
   * Get blog analytics
   */
  static async getBlogAnalytics(): Promise<BlogAnalytics> {
    const response: AxiosResponse<BlogAnalytics> = await blogApi.get('/analytics/');
    return response.data;
  }

  /**
   * Get post analytics
   */
  static async getPostAnalytics(postSlug: string): Promise<PostAnalytics> {
    const response: AxiosResponse<PostAnalytics> = await blogApi.get(`/analytics/?post__slug=${postSlug}`);
    return response.data;
  }
}

// Export all APIs as a single object for convenience
export const BlogApi = {
  posts: BlogPostApi,
  interactions: BlogInteractionApi,
  readingProgress: ReadingProgressApi,
  comments: CommentApi,
  categories: CategoryApi,
  tags: TagApi,
  analytics: AnalyticsApi,
};

export default BlogApi;

