import { NextRequest, NextResponse } from 'next/server';
import { blogApi } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Fetch all published blog posts
    const response = await blogApi.getPublished({ page_size: 100 });
    const posts = response.data.results || response.data || [];

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KKEVO Blog</title>
    <description>Insights, tutorials, and industry knowledge from our team of experts</description>
    <link>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog</link>
    <atom:link href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>KKEVO Blog RSS Generator</generator>
    ${posts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}</link>
      <guid>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <category>${post.category}</category>
      ${post.tags?.map((tag: any) => `<category>${tag}</category>`).join('') || ''}
      ${post.author ? `<author>${post.author.email || post.author.name}</author>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

