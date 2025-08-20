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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  hero_image?: string;
  hero_image_url?: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  reading_time: number;
  views?: number;
  likes?: number;
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
  long_description: string;
  category: string;
  client: string;
  year: string;
  hero_image?: string;
  gallery_images: string[];
  technologies: string[];
  duration: string;
  team_size: string;
  results: Record<string, string>;
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
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
