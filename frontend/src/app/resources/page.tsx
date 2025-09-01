import { Metadata } from 'next';
import { commonMeta } from '../seo';
import ResourcesPageClient from './ResourcesPageClient';

export const metadata: Metadata = {
  ...commonMeta.resources,
  title: 'Resources - KKEVO',
  description: 'Access our comprehensive library of guides, templates, tools, and resources to accelerate your software development projects.',
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}

