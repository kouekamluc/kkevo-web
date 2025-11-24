/**
 * Blog Models - Frontend data models for type safety and state management
 */

// Base interfaces
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Author extends BaseModel {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

export interface BlogCategory extends BaseModel {
  name: string;
  slug: string;
  description: string;
  color: string;
  order: number;
  is_active: boolean;
  post_count: number;
}

export interface BlogTag extends BaseModel {
  name: string;
  slug: string;
  color: string;
  post_count: number;
}

export interface EngagementStats {
  total_engagement: number;
  engagement_rate: number;
}

export interface UserInteractions {
  is_liked: boolean;
  is_bookmarked: boolean;
  reading_progress?: ReadingProgress;
}

export interface ReadingProgress {
  progress_percentage: number;
  time_spent: number;
  is_completed: boolean;
  last_read_at: string;
}

// Blog Post Models
export interface BlogPostList extends BaseModel {
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  author: Author;
  category: BlogCategory;
  tags: Array<{ name: string; slug: string }>;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: string;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  share_count: number;
  comment_count: number;
  reading_time: number;
  engagement_stats: EngagementStats;
}

export interface BlogPostDetail extends BlogPostList {
  body: string;
  meta_title: string;
  meta_description: string;
  related_posts: BlogPostList[];
  user_interactions: UserInteractions;
}

// Interaction Models
export interface BlogPostLike extends BaseModel {
  user: Author;
  post: string;
  post_title: string;
  ip_address?: string;
  liked_at: string;
}

export interface BlogPostBookmark extends BaseModel {
  user: Author;
  post: string;
  post_title: string;
  ip_address?: string;
  bookmarked_at: string;
}

export interface BlogPostShare extends BaseModel {
  user: Author;
  post: string;
  post_title: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy_link' | 'other';
  platform_display: string;
  ip_address?: string;
  shared_at: string;
}

export interface BlogPostComment extends BaseModel {
  user: Author;
  post: string;
  parent?: string;
  content: string;
  is_approved: boolean;
  is_moderated: boolean;
  replies: BlogPostComment[];
  reply_count: number;
}

export interface UserReadingProgressModel extends BaseModel {
  user: Author;
  post: string;
  post_title: string;
  post_slug: string;
  progress_percentage: number;
  time_spent: number;
  last_position: number;
  is_completed: boolean;
  completed_at?: string;
  last_read_at: string;
}

// Request/Response Models
export interface BlogInteractionRequest {
  action: 'like' | 'unlike' | 'bookmark' | 'unbookmark' | 'share';
  platform?: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy_link' | 'other';
}

export interface ReadingProgressRequest {
  post: string;
  progress_percentage: number;
  time_spent: number;
  last_position: number;
}

export interface BlogSearchRequest {
  q: string;
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// API Response Models
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface BlogInteractionResponse {
  success: boolean;
  message: string;
  like_count?: number;
  bookmark_count?: number;
  share_count?: number;
  like_id?: string;
  bookmark_id?: string;
  share_id?: string;
}

export interface ReadingProgressResponse {
  success: boolean;
  message: string;
  progress_percentage: number;
  is_completed: boolean;
  time_spent: number;
}

// Dashboard Models
export interface UserInteractionsSummary {
  liked_posts: string[];
  bookmarked_posts: string[];
  liked_count: number;
  bookmarked_count: number;
}

export interface ReadingAnalytics {
  total_posts_read: number;
  completed_posts: number;
  completion_rate: number;
  total_time_spent: number;
  average_progress: number;
}

export interface BlogDashboard {
  interactions: UserInteractionsSummary;
  recent_reading_progress: UserReadingProgressModel[];
  recent_posts: BlogPostList[];
}

// State Management Models
export interface BlogState {
  posts: {
    list: BlogPostList[];
    detail: BlogPostDetail | null;
    featured: BlogPostList[];
    popular: BlogPostList[];
    recent: BlogPostList[];
    related: BlogPostList[];
    search: BlogPostList[];
    loading: boolean;
    error: string | null;
  };
  categories: {
    list: BlogCategory[];
    loading: boolean;
    error: string | null;
  };
  tags: {
    list: BlogTag[];
    loading: boolean;
    error: string | null;
  };
  interactions: {
    likes: string[];
    bookmarks: string[];
    shares: string[];
    loading: boolean;
    error: string | null;
  };
  readingProgress: {
    current: ReadingProgress | null;
    history: UserReadingProgressModel[];
    analytics: ReadingAnalytics | null;
    loading: boolean;
    error: string | null;
  };
  comments: {
    list: BlogPostComment[];
    loading: boolean;
    error: string | null;
  };
  dashboard: {
    data: BlogDashboard | null;
    loading: boolean;
    error: string | null;
  };
}

// Form Models
export interface BlogPostForm {
  title: string;
  excerpt: string;
  body: string;
  featured_image?: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
}

export interface CommentForm {
  content: string;
  parent?: string;
}

// Filter Models
export interface BlogFilters {
  category?: string;
  tags?: string[];
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  author?: string;
  date_from?: string;
  date_to?: string;
}

export interface BlogSortOptions {
  field: 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'like_count' | 'title';
  direction: 'asc' | 'desc';
}

// Error Models
export interface BlogError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Analytics Models
export interface BlogAnalytics {
  total_posts: number;
  total_likes: number;
  total_bookmarks: number;
  total_shares: number;
  total_comments: number;
  popular_posts: Array<{
    id: string;
    title: string;
    slug: string;
    engagement: number;
  }>;
}

export interface PostAnalytics {
  likes: number;
  bookmarks: number;
  shares: number;
  comments: number;
  total_readers: number;
  completed_readers: number;
  completion_rate: number;
  average_progress: number;
}

