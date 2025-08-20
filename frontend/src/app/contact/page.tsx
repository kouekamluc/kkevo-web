import { Metadata } from 'next';
import { commonMeta } from '../seo';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = commonMeta.contact;

export default function ContactPage() {
  return <ContactPageClient />;
}
