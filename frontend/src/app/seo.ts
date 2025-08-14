import { DefaultSeoProps } from 'next-seo';

export const defaultSEO: DefaultSeoProps = {
  titleTemplate: '%s | KKEVO',
  defaultTitle: 'KKEVO - Software Development Company | We Build Software That Moves Markets',
  description: 'KKEVO is a leading software development company specializing in web development, mobile apps, cloud solutions, and digital transformation. We deliver cutting-edge software that drives business growth.',
  canonical: 'https://kkevo.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kkevo.com',
    siteName: 'KKEVO',
    title: 'KKEVO - Software Development Company',
    description: 'We Build Software That Moves Markets',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KKEVO - Software Development Company',
      },
    ],
  },
  twitter: {
    handle: '@kkevo',
    site: '@kkevo',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#1e1b4b',
    },
    {
      name: 'msapplication-TileColor',
      content: '#1e1b4b',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      href: '/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      rel: 'icon',
      href: '/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'We Build Software That Moves Markets',
    description: 'Transform your business with cutting-edge software solutions. We deliver innovative, scalable applications that drive growth and create competitive advantages.',
  },
  services: {
    title: 'Our Services',
    description: 'Comprehensive software development services including web development, mobile apps, cloud solutions, and digital transformation.',
  },
  about: {
    title: 'About KKEVO',
    description: 'Meet our team of experts and learn about our mission to deliver exceptional software solutions that drive business success.',
  },
  work: {
    title: 'Our Work',
    description: 'Explore our portfolio of successful projects and case studies showcasing our expertise in software development.',
  },
  blog: {
    title: 'Blog & Insights',
    description: 'Stay updated with the latest trends in software development, technology insights, and industry best practices.',
  },
  contact: {
    title: 'Contact Us',
    description: 'Ready to start your project? Get in touch with our team to discuss how we can help bring your vision to life.',
  },
};
