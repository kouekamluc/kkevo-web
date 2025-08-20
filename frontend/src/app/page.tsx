import { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import ServicesMarquee from '@/components/sections/ServicesMarquee';
import CaseStudyCarousel from '@/components/sections/CaseStudyCarousel';
import TestimonialSlider from '@/components/sections/TestimonialSlider';
import TeamPreview from '@/components/sections/TeamPreview';
import BlogPreview from '@/components/sections/BlogPreview';
import StatsSection from '@/components/sections/StatsSection';
import CTASection from '@/components/sections/CTASection';

import { Service, Testimonial, TeamMember, BlogPost } from '@/types';
import { commonMeta } from './seo';

export const metadata: Metadata = commonMeta.home;

async function getHomePageData() {
  try {
    // Fetch services, testimonials, team, and blog data in parallel
    const [servicesResponse, testimonialsResponse, teamResponse, blogResponse] = await Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/services/?limit=6&ordering=order`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/testimonials/?limit=5&ordering=-created_at`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/team/?limit=3&ordering=order`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/blog/?limit=3&ordering=-published_at`, { cache: 'no-store' })
    ]);

    const services = servicesResponse.status === 'fulfilled' && servicesResponse.value.ok
      ? await servicesResponse.value.json().then((data: { results?: Service[] }) => data.results || [])
      : [];
    
    const testimonials = testimonialsResponse.status === 'fulfilled' && testimonialsResponse.value.ok
      ? await testimonialsResponse.value.json().then((data: { results?: Testimonial[] }) => data.results || [])
      : [];
    
    const teamMembers = teamResponse.status === 'fulfilled' && teamResponse.value.ok
      ? await teamResponse.value.json().then((data: { results?: TeamMember[] }) => data.results || [])
      : [];

    const blogPosts = blogResponse.status === 'fulfilled' && blogResponse.value.ok
      ? await blogResponse.value.json().then((data: { results?: BlogPost[] }) => data.results || [])
      : [];

    return { services, testimonials, teamMembers, blogPosts };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return { services: [], testimonials: [], teamMembers: [], blogPosts: [] };
  }
}

export default async function HomePage() {
  const { services, testimonials, teamMembers, blogPosts } = await getHomePageData();

  return (
    <>
      <HeroSection />
      <ServicesMarquee services={services} />
      <CaseStudyCarousel />
      <TestimonialSlider testimonials={testimonials} />
      <TeamPreview teamMembers={teamMembers} />
      <BlogPreview blogPosts={blogPosts} />
      <StatsSection />
      <CTASection />
    </>
  );
}
