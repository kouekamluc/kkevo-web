import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - KKEVO',
  description: 'Insights, tutorials, and industry knowledge from our team of experts. Stay ahead with the latest in technology, business, and development.',
  keywords: 'blog, technology, business, development, AI, machine learning, tutorials, insights',
  openGraph: {
    title: 'KKEVO Blog - Technology Insights & Tutorials',
    description: 'Stay ahead with the latest insights, tutorials, and industry knowledge from our team of experts.',
    type: 'website',
    url: '/blog',
  },
  alternates: {
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* RSS Feed Link */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="KKEVO Blog RSS Feed"
        href="/blog/rss.xml"
      />
      {children}
    </>
  );
}









