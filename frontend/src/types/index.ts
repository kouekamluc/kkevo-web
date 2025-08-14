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
  created_at: string;
  updated_at: string;
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
  author: TeamMember;
  tags: string[];
  status: 'draft' | 'published';
  published_at?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
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
