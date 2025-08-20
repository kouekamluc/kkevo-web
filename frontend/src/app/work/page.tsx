import { Metadata } from 'next';
import { commonMeta } from '../seo';
import WorkPageClient from './WorkPageClient';

export const metadata: Metadata = commonMeta.work;

export default function WorkPage() {
  return <WorkPageClient />;
}
