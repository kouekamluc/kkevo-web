/**
 * Configuration for allowed image domains
 * This file centralizes all allowed external image domains for easy maintenance
 */

export const ALLOWED_IMAGE_DOMAINS = [
  // Google services
  'www.google.com',
  'maps.google.com',
  'lh3.googleusercontent.com',
  
  // Freepik and stock photo services
  'as1.ftcdn.net',
  'as2.ftcdn.net',
  'as3.ftcdn.net',
  'as4.ftcdn.net',
  'img.freepik.com',
  
  // Unsplash
  'images.unsplash.com',
  
  // Placeholder services
  'via.placeholder.com',
  'picsum.photos',
  
  // Other stock photo services
  'cdn.pixabay.com',
  'cdn.stocksnap.io',
  
  // Local development
  'localhost',
  '127.0.0.1',
] as const;

export const BLOCKED_IMAGE_PARAMS = [
  'sca_esv',    // Google search parameter
  'sxsrf',      // CSRF token
  'q',          // Query parameter
  'search',     // Search parameter
  'query',      // Query parameter
  'form',       // Form parameter
  'submit',     // Submit parameter
] as const;

export const BLOCKED_IMAGE_HOSTS = [
  'www.google.com', // Block Google search URLs specifically
] as const;

export const BLOCKED_IMAGE_PATHS = [
  '/search',    // Google search paths
] as const;

/**
 * Check if a hostname is in the blocked list
 */
export const isBlockedHost = (hostname: string): boolean => {
  return BLOCKED_IMAGE_HOSTS.some(blocked => hostname === blocked);
};

/**
 * Check if a pathname contains blocked paths
 */
export const isBlockedPath = (pathname: string): boolean => {
  return BLOCKED_IMAGE_PATHS.some(blocked => pathname.includes(blocked));
};

/**
 * Check if URL parameters contain blocked parameters
 */
export const hasBlockedParams = (searchParams: URLSearchParams): boolean => {
  return BLOCKED_IMAGE_PARAMS.some(param => searchParams.has(param));
};

/**
 * Check if a hostname is allowed for images
 */
export const isAllowedHost = (hostname: string): boolean => {
  return ALLOWED_IMAGE_DOMAINS.some(allowed => hostname === allowed);
};



