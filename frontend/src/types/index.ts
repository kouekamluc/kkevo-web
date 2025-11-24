// API Response Types
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Model Types
export interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon?: string;
  features: string[];
  category: string;
  order: number;
  is_active: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  reading_time?: number;
  
  // Pricing & Budget
  pricing_tiers?: Record<string, string>;
  timeline_estimates?: Record<string, string>;
  budget_ranges?: Record<string, string>;
  min_budget?: number;
  max_budget?: number;
  
  // Project Details
  complexity_levels?: string[];
  deliverables?: string[];
  average_project_duration?: string;
  success_rate?: number;
  
  // Display Properties
  display_budget_range?: string;
  display_timeline?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  social_links: Record<string, string>;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client: string;
  company: string;
  quote: string;
  logo?: string;
  rating: number;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  summary?: string;
  body: string;
  featured_image?: string;
  hero_image?: string;
  featured_image_url?: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    description: string;
    order: number;
    is_active: boolean;
  } | null;
  category_name?: string; // Backward compatibility
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at: string;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  estimated_reading_time: number;
  word_count: number;
  view_count: number;
  like_count: number;
  bookmark_count: number;
  share_count: number;
  comment_count: number;
  meta_title?: string;
  meta_description?: string;
  difficulty_level?: string;
  canonical_url?: string;
  related_services?: string;
  long_description?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  reading_time?: number; // Alias for estimated_reading_time
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  
  // Project Details
  project_budget?: string;
  timeline?: string;
  team_size?: string;
  industry?: string;
  urgency?: string;
  
  // Lead Management
  lead_score: number;
  status: string;
  assigned_to?: string;
  notes?: string;
  
  // Tracking
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  
  // Timestamps
  submitted_at: string;
  first_contacted_at?: string;
  last_contacted_at?: string;
  follow_up_scheduled?: string;
  follow_up_completed?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyStats {
  id: string;
  name: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon_name: string;
  color_scheme: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  display_value: string;
}

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  category: string;
  client: string;
  year: string;
  
  // Business Context & Problem Solving
  challenge?: string;
  solution?: string;
  
  // Business Impact & ROI
  business_objectives?: string[];
  roi_metrics?: Record<string, string>;
  key_results?: string[];
  results: Record<string, string>;
  
  // Project Details
  budget_range?: string;
  project_timeline?: string;
  team_size: string;
  duration: string;
  
  // Client Feedback & Testimonials
  client_testimonial?: string;
  client_name?: string;
  client_role?: string;
  client_company?: string;
  
  // Media & Links
  hero_image?: string;
  gallery_images: string[];
  technologies: string[];
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
  
  // Status & Organization
  is_featured: boolean;
  order: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  reading_time: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  description: string;
  client_name: string;
  client_industry: string;
  client_size?: string;
  category: string;
  project_duration: string;
  team_size: string;
  budget_range?: string;
  challenge: string;
  solution: string;
  approach: string;
  technologies: string[];
  tools: string[];
  business_objectives: string[];
  key_results: string[];
  metrics: Record<string, string>;
  roi?: string;
  client_testimonial?: string;
  client_contact_name?: string;
  client_contact_role?: string;
  hero_image?: string;
  gallery_images: string[];
  live_url?: string;
  case_study_pdf?: string;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  reading_time: number;
  has_metrics: boolean;
  has_testimonial: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

// Animation Types
export interface AnimationProps {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

// Component Props
export interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// API Endpoints
export interface ApiEndpoints {
  services: string;
  team: string;
  testimonials: string;
  blog: string;
  contact: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Store Types
export interface AppState {
  theme: Theme;
  mobileNavOpen: boolean;
  setTheme: (theme: Theme) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export interface CompanyConfig {
  hero_headline: string;
  hero_subtitle: string;
  hero_features: string[];
  cta_headline: string;
  cta_subtitle: string;
  cta_benefits: string[];
  company_phone: string;
  company_email: string;
  company_address: string;
  live_chat_enabled: boolean;
  trust_companies: string[];
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
}

export interface LeadMagnetSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  lead_magnet_type: string;
  source: string;
  form_submitted_at: string;
  pdf_downloaded_at?: string;
  email_sent_at?: string;
  email_opened_at?: string;
  is_subscribed_to_newsletter: boolean;
  follow_up_scheduled?: string;
  follow_up_completed?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  notes?: string;
  lead_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  description: string;
  order: number;
  is_active: boolean;
}

export interface ResourceType {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  is_active: boolean;
}

export interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  file_size: string;
  format: string;
  estimated_time: string;
  thumbnail?: string;
  file?: string;
  external_url?: string;
  author: string;
  is_featured: boolean;
  is_premium: boolean;
  order: number;
  is_active: boolean;
  download_count: number;
  view_count: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface ResourceDownload {
  id: number;
  resource: number;
  user?: number;
  ip_address?: string;
  user_agent: string;
  referrer: string;
  downloaded_at: string;
}

export interface ResourceRating {
  id: number;
  resource: number;
  user?: number;
  ip_address?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceView {
  id: number;
  resource: number;
  user?: number;
  ip_address?: string;
  user_agent: string;
  referrer: string;
  viewed_at: string;
}

// Blog-related types
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface BlogComment {
  id: number;
  post: string;
  user: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  parent: number | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  reply_count: number;
  is_reply: boolean;
  replies: BlogComment[];
}

export interface BlogUserActivity {
  recent_comments: BlogComment[];
  recent_likes: BlogPostLike[];
  recent_bookmarks: BlogPostBookmark[];
}

export interface BlogDashboard {
  reading_progress: UserReadingProgress[];
  liked_posts_count: number;
  bookmarked_posts_count: number;
  recently_read: BlogPost[];
}

export interface UserReadingProgress {
  id: number;
  user: string;
  post: string;
  progress_percentage: number;
  time_spent: number;
  last_position: number;
  is_completed: boolean;
  completed_at: string | null;
  last_read_at: string;
}

export interface BlogPostLike {
  id: number;
  post: string;
  user?: string;
  ip_address?: string;
  liked_at: string;
}

export interface BlogPostBookmark {
  id: number;
  post: string;
  user?: string;
  ip_address?: string;
  bookmarked_at: string;
}

export interface BlogPostShare {
  id: number;
  post: string;
  user?: string;
  ip_address?: string;
  platform: string;
  shared_at: string;
}

export interface BlogPostView {
  id: number;
  post: string;
  user?: string;
  ip_address?: string;
  user_agent: string;
  referrer: string;
  viewed_at: string;
}

export interface BlogPostAnalytics {
  id: number;
  post: string;
  unique_views: number;
  returning_visitors: number;
  bounce_rate: number;
  average_time_on_page: number;
  average_scroll_depth: number;
  completion_rate: number;
  social_shares: Record<string, number>;
  social_clicks: Record<string, number>;
  search_impressions: number;
  search_clicks: number;
  ctr: number;
  lead_generations: number;
  newsletter_signups: number;
  updated_at: string;
}
