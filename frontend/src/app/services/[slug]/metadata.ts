import { Metadata } from 'next';
import { generateDynamicMeta } from '../../seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/services/${params.slug}/`, { cache: 'no-store' });
    if (!response.ok) {
      return {
        title: 'Service Not Found',
        description: 'The service you are looking for does not exist.',
      };
    }
    
    const service = await response.json();
    return generateDynamicMeta('service', {
      title: service.title,
      description: service.short_desc,
      slug: service.slug,
    });
  } catch (error) {
    return {
      title: 'Service Not Found',
      description: 'The service you are looking for does not exist.',
    };
  }
}
