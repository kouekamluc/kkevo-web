import { Metadata } from 'next';
import { commonMeta } from '../seo';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = commonMeta.services;

export default function ServicesPage() {
  return <ServicesPageClient />;
}
