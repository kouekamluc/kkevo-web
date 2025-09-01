import { Metadata } from 'next';

export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function generateMeta(data: MetaData): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/images/og-default.jpg',
    url = '',
  } = data;

  const fullTitle = `${title} | KKEVO - Digital Innovation Agency`;
  const fullUrl = url ? `https://kkevo.app${url}` : 'https://kkevo.app';

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'KKEVO Team' }],
    creator: 'KKEVO',
    publisher: 'KKEVO',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: 'KKEVO',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@kkevo',
      site: '@kkevo',
    },
    alternates: {
      canonical: fullUrl,
    },
    category: 'technology',
  };
}

// Predefined meta data for common pages
export const commonMeta = {
  home: generateMeta({
    title: 'Digital Innovation Agency',
    description: 'KKEVO is a leading digital innovation agency specializing in web development, mobile apps, AI solutions, and digital transformation. We help businesses thrive in the digital age.',
    keywords: ['digital agency', 'web development', 'mobile apps', 'AI solutions', 'digital transformation'],
    url: '/',
  }),
  
  about: generateMeta({
    title: 'About Us',
    description: 'Meet the KKEVO team of experts in technology, design, and innovation. Learn about our mission to transform businesses through cutting-edge digital solutions.',
    keywords: ['about us', 'team', 'mission', 'values', 'expertise'],
    url: '/about',
  }),
  
  services: generateMeta({
    title: 'Our Services',
    description: 'Discover our comprehensive range of digital services including web development, mobile app development, AI & ML solutions, DevOps, and digital consulting.',
    keywords: ['services', 'web development', 'mobile development', 'AI', 'DevOps', 'consulting'],
    url: '/services',
  }),
  
  work: generateMeta({
    title: 'Our Work',
    description: 'Explore our portfolio of successful digital projects and case studies. See how we\'ve helped businesses achieve their digital transformation goals.',
    keywords: ['portfolio', 'case studies', 'projects', 'work examples', 'success stories'],
    url: '/work',
  }),
  
  blog: generateMeta({
    title: 'Blog & Insights',
    description: 'Stay updated with the latest trends in technology, digital innovation, and industry insights from our team of experts.',
    keywords: ['blog', 'insights', 'technology trends', 'digital innovation', 'industry news'],
    url: '/blog',
  }),
  
  contact: generateMeta({
    title: 'Get In Touch',
    description: 'Ready to start your digital transformation journey? Contact KKEVO today for a free consultation and discover how we can help your business grow.',
    keywords: ['contact', 'consultation', 'get quote', 'start project', 'free consultation'],
    url: '/contact',
  }),
  
  resources: generateMeta({
    title: 'Free Resources',
    description: 'Access our comprehensive library of guides, templates, tools, and resources to accelerate your software development projects and business growth.',
    keywords: ['resources', 'guides', 'templates', 'tools', 'downloads', 'free resources'],
    url: '/resources',
  }),
  
  admin: generateMeta({
    title: 'Admin Dashboard',
    description: 'Administrative dashboard for managing KKEVO content and settings',
    keywords: ['admin', 'dashboard', 'management', 'content management'],
    url: '/admin',
  }),
};

// Helper for dynamic pages
export function generateDynamicMeta(
  type: 'service' | 'blog' | 'team',
  data: { title: string; description: string; slug: string }
): Metadata {
  const { title, description, slug } = data;
  
  // Map type to correct URL pattern
  const urlMap = {
    service: `/services/${slug}`,
    blog: `/blog/${slug}`,
    team: `/team/${slug}`
  };
  
  return generateMeta({
    title,
    description,
    keywords: [type, title.toLowerCase(), 'kkevo'],
    url: urlMap[type],
  });
}
