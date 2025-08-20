import { NextRequest, NextResponse } from 'next/server';
import { blogApi } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Fetch all published blog posts
    const response = await blogApi.getPublished({ page_size: 1000 });
    const posts = response.data.results || response.data || [];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts.map((post: any) => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at || post.published_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${Array.from(new Set(posts.map((post: any) => post.category))).map((category: any) => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/category/${category}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

