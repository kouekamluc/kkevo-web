import { Metadata } from 'next'
import LeadMagnetFunnel from './LeadMagnetFunnel'
import { useLeadMagnetFunnel } from '@/lib/features'

export const metadata: Metadata = {
  title: 'Django SaaS Checklist - Free 12-Page Guide | KKEVO',
  description: 'Download our comprehensive Django SaaS checklist. 12 pages of proven strategies to build and launch your SaaS in 90 days. Free guide from KKEVO.',
  keywords: 'Django SaaS checklist, SaaS development guide, Django development, SaaS launch checklist',
  openGraph: {
    title: 'Free Django SaaS Checklist - Launch Your SaaS in 90 Days',
    description: 'Get our proven 12-page Django SaaS checklist. Everything you need to build, launch, and scale your SaaS business.',
    type: 'website',
    url: '/resources/django-saas-checklist',
  },
}

export default function DjangoSaasChecklistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <LeadMagnetFunnel />
      </div>
    </div>
  )
}
