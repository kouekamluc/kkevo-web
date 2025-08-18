import { notFound } from 'next/navigation';
import ServiceDetailClient from './ServiceDetailClient';
import { Service } from '@/types';

// Generate static params for all services
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/services/`, { cache: 'no-store' });
    const data = await response.json();
    const services = data.results || [];
    
    return services.map((service: Service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Fetch service data
async function getService(slug: string): Promise<Service | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/services/${slug}/`, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

interface ServiceDetailPageProps {
  params: { slug: string };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = await getService(params.slug);
  
  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
