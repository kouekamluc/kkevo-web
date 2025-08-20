import { Metadata } from 'next';
import { commonMeta } from '../seo';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = commonMeta.about;

export default function AboutPage() {
  return <AboutPageClient />;
}
