import { Metadata } from 'next';
import { generateDynamicMeta } from '../../seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/blog/${params.slug}/`, { cache: 'no-store' });
    if (!response.ok) {
      return {
        title: 'Blog Post Not Found',
        description: 'The blog post you are looking for does not exist.',
      };
    }
    
    const post = await response.json();
    return generateDynamicMeta('blog', {
      title: post.title,
      description: post.excerpt,
      slug: post.slug,
    });
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }
}
