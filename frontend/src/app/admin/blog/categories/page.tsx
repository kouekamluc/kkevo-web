import { Metadata } from 'next';
import { commonMeta } from '@/app/seo';
import CategoriesManagement from './CategoriesManagement';

export const metadata: Metadata = {
  ...commonMeta.admin,
  title: 'Blog Categories - Admin Dashboard',
  description: 'Manage blog categories and organization',
};

export default function CategoriesPage() {
  return <CategoriesManagement />;
}

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
