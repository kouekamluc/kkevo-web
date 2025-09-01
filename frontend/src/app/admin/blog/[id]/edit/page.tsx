import { Metadata } from 'next';
import { commonMeta } from '../../../../seo';
import BlogPostForm from '../../BlogPostForm';

export const metadata: Metadata = {
  ...commonMeta.admin,
  title: 'Edit Blog Post - Admin Dashboard',
  description: 'Edit your blog post content and settings',
};

export default function EditBlogPostPage() {
  return <BlogPostForm mode="edit" />;
}

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
