import { Metadata } from 'next';
import { commonMeta } from '../seo';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = commonMeta.blog;

export default function BlogPage() {
  return <BlogPageClient />;
}
