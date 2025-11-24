'use client';

import React from 'react';
import { Metadata } from 'next';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  type?: 'article' | 'website';
}

/**
 * Comprehensive SEO Component
 * Generates meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  type = 'article',
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = url ? `${siteUrl}${url}` : (typeof window !== 'undefined' ? window.location.href : '');
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : 'WebPage',
    headline: title,
    description,
    image: fullImage,
    url: fullUrl,
    ...(type === 'article' && {
      author: {
        '@type': 'Person',
        name: author || 'KKEVO Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'KKEVO',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      ...(tags.length > 0 && {
        keywords: tags.join(', '),
      }),
    }),
  };

  // Use useEffect to update document head
  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Create or update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    if (author) updateMetaTag('author', author);
    if (tags.length > 0) updateMetaTag('keywords', tags.join(', '));

    // Open Graph / Facebook
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', fullImage, true);
    updateMetaTag('og:site_name', 'KKEVO', true);

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', fullUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImage);

    // Article specific
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
      if (author) updateMetaTag('article:author', author, true);
      tags.forEach((tag) => {
        updateMetaTag('article:tag', tag, true);
      });
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // RSS Feed
    let rss = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    if (!rss) {
      rss = document.createElement('link');
      rss.setAttribute('rel', 'alternate');
      rss.setAttribute('type', 'application/rss+xml');
      rss.setAttribute('title', 'KKEVO Blog RSS Feed');
      document.head.appendChild(rss);
    }
    rss.setAttribute('href', `${siteUrl}/api/v1/blog/rss/`);

    // JSON-LD Structured Data
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLd);
  }, [title, description, image, url, author, publishedTime, modifiedTime, tags, type]);

  return null;
};

export default SEOHead;

