import { Metadata } from 'next';
import { commonMeta } from '../../../seo';
import BlogPostForm from '../BlogPostForm';

export const metadata: Metadata = {
  ...commonMeta.admin,
  title: 'Create New Blog Post - Admin Dashboard',
  description: 'Create a new blog post with rich content and metadata',
};

export default function NewBlogPostPage() {
  return <BlogPostForm />;
}

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
