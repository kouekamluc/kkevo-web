import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import ServicesMarquee from '@/components/sections/ServicesMarquee';
import CaseStudyCarousel from '@/components/sections/CaseStudyCarousel';
import TestimonialSlider from '@/components/sections/TestimonialSlider';
import StatsSection from '@/components/sections/StatsSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'KKEVO - Software Development Company | We Build Software That Moves Markets',
  description: 'KKEVO is a leading software development company specializing in web development, mobile apps, cloud solutions, and digital transformation. We deliver cutting-edge software that drives business growth.',
  keywords: 'software development, web development, mobile apps, cloud solutions, digital transformation, KKEVO, custom software',
  openGraph: {
    title: 'KKEVO - Software Development Company',
    description: 'We Build Software That Moves Markets',
    type: 'website',
    url: 'https://kkevo.com',
    siteName: 'KKEVO',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KKEVO - Software Development Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KKEVO - Software Development Company',
    description: 'We Build Software That Moves Markets',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesMarquee />
      <CaseStudyCarousel />
      <TestimonialSlider />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
