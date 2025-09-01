'use client';

import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import ServicesMarquee from '@/components/sections/ServicesMarquee';
import CaseStudyCarousel from '@/components/sections/CaseStudyCarousel';
import TestimonialSlider from '@/components/sections/TestimonialSlider';
import TeamPreview from '@/components/sections/TeamPreview';
import BlogPreview from '@/components/sections/BlogPreview';
import StatsSection from '@/components/sections/StatsSection';
import CTASection from '@/components/sections/CTASection';

import { Service, Testimonial, TeamMember, BlogPost } from '@/types';
import { servicesApi, testimonialsApi, teamApi, blogApi } from '@/lib/api';

async function getHomePageData() {
  try {
    // Use the proper API client that handles Auth0 tokens
    const [servicesResponse, testimonialsResponse, teamResponse, blogResponse] = await Promise.allSettled([
      servicesApi.getAll({ limit: 6, ordering: 'order' }),
      testimonialsApi.getAll({ limit: 5, ordering: '-created_at' }),
      teamApi.getAll({ limit: 3, ordering: 'order' }),
      blogApi.getAll({ limit: 3, ordering: '-published_at' })
    ]);

    const services = servicesResponse.status === 'fulfilled' 
      ? (servicesResponse.value.data?.results || servicesResponse.value.data || [])
      : [];
    
    const testimonials = testimonialsResponse.status === 'fulfilled' 
      ? (testimonialsResponse.value.data?.results || testimonialsResponse.value.data || [])
      : [];
    
    const teamMembers = teamResponse.status === 'fulfilled' 
      ? (teamResponse.value.data?.results || teamResponse.value.data || [])
      : [];

    const blogPosts = blogResponse.status === 'fulfilled' 
      ? (blogResponse.value.data?.results || blogResponse.value.data || [])
      : [];

    return { services, testimonials, teamMembers, blogPosts };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    // Return empty arrays on error to prevent page from breaking
    return { services: [], testimonials: [], teamMembers: [], blogPosts: [] };
  }
}

export default function HomePage() {
  const [data, setData] = React.useState<{
    services: Service[];
    testimonials: Testimonial[];
    teamMembers: TeamMember[];
    blogPosts: BlogPost[];
  }>({
    services: [],
    testimonials: [],
    teamMembers: [],
    blogPosts: []
  });

  React.useEffect(() => {
    getHomePageData().then(setData);
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesMarquee services={data.services} />
      <CaseStudyCarousel />
      <TestimonialSlider testimonials={data.testimonials} />
      <TeamPreview teamMembers={data.teamMembers} />
      <BlogPreview blogPosts={data.blogPosts} />
      <StatsSection />
      <CTASection />
    </>
  );
}
