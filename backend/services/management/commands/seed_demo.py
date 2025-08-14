"""
Management command to seed demo data for KKEVO.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from services.models import Service
from team.models import TeamMember
from testimonials.models import Testimonial
from blog.models import BlogPost
from contact.models import ContactSubmission


class Command(BaseCommand):
    """Seed demo data for KKEVO."""
    
    help = 'Seed demo data for KKEVO project'
    
    def handle(self, *args, **options):
        """Execute the command."""
        self.stdout.write('🌱 Starting to seed demo data...')
        
        # Create team members first
        self.create_team_members()
        
        # Create services
        self.create_services()
        
        # Create testimonials
        self.create_testimonials()
        
        # Create blog posts
        self.create_blog_posts()
        
        # Create contact submissions
        self.create_contact_submissions()
        
        self.stdout.write(
            self.style.SUCCESS('✅ Demo data seeded successfully!')
        )
    
    def create_team_members(self):
        """Create demo team members."""
        self.stdout.write('👥 Creating team members...')
        
        team_data = [
            {
                'name': 'Alex Chen',
                'role': 'ceo',
                'bio': 'Visionary leader with 15+ years in software development. Passionate about innovation and building teams that deliver exceptional results.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/alexchen',
                    'github': 'https://github.com/alexchen',
                    'twitter': 'https://twitter.com/alexchen'
                },
                'order': 1
            },
            {
                'name': 'Sarah Johnson',
                'role': 'cto',
                'bio': 'Technical architect and engineering leader. Expert in scalable systems, cloud infrastructure, and emerging technologies.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/sarahjohnson',
                    'github': 'https://github.com/sarahjohnson'
                },
                'order': 2
            },
            {
                'name': 'Marcus Rodriguez',
                'role': 'developer',
                'bio': 'Full-stack developer specializing in React, Node.js, and Python. Loves clean code and solving complex problems.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/marcusrodriguez',
                    'github': 'https://github.com/marcusrodriguez'
                },
                'order': 3
            },
            {
                'name': 'Emily Watson',
                'role': 'designer',
                'bio': 'UX/UI designer focused on creating intuitive, beautiful interfaces that users love to interact with.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/emilywatson',
                    'dribbble': 'https://dribbble.com/emilywatson'
                },
                'order': 4
            },
            {
                'name': 'David Kim',
                'role': 'devops',
                'bio': 'DevOps engineer passionate about automation, monitoring, and building robust infrastructure.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/davidkim',
                    'github': 'https://github.com/davidkim'
                },
                'order': 5
            },
            {
                'name': 'Lisa Park',
                'role': 'pm',
                'bio': 'Project manager with a technical background. Ensures projects are delivered on time and exceed expectations.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/lisapark'
                },
                'order': 6
            }
        ]
        
        for data in team_data:
            TeamMember.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
        
        self.stdout.write(f'✅ Created {len(team_data)} team members')
    
    def create_services(self):
        """Create demo services."""
        self.stdout.write('🛠️ Creating services...')
        
        services_data = [
            {
                'title': 'Web Application Development',
                'short_desc': 'Custom web applications built with modern technologies and best practices.',
                'long_desc': 'We build scalable, secure web applications using the latest technologies. Our team specializes in React, Vue.js, Django, and Node.js, delivering solutions that drive business growth.',
                'category': 'web',
                'features': [
                    'Responsive design for all devices',
                    'Modern frontend frameworks',
                    'Scalable backend architecture',
                    'Security best practices',
                    'Performance optimization',
                    'SEO optimization'
                ],
                'order': 1
            },
            {
                'title': 'Mobile App Development',
                'short_desc': 'Native and cross-platform mobile applications for iOS and Android.',
                'long_desc': 'From concept to deployment, we create engaging mobile experiences that users love. We work with React Native, Flutter, and native iOS/Android development.',
                'category': 'mobile',
                'features': [
                    'Native iOS and Android development',
                    'Cross-platform solutions',
                    'App Store optimization',
                    'Push notifications',
                    'Offline functionality',
                    'Performance monitoring'
                ],
                'order': 2
            },
            {
                'title': 'DevOps & Infrastructure',
                'short_desc': 'Streamline your development process with modern DevOps practices.',
                'long_desc': 'We help teams deploy faster and more reliably with CI/CD pipelines, containerization, and cloud infrastructure management.',
                'category': 'devops',
                'features': [
                    'CI/CD pipeline setup',
                    'Docker containerization',
                    'Cloud infrastructure (AWS, GCP, Azure)',
                    'Monitoring and logging',
                    'Security scanning',
                    'Automated testing'
                ],
                'order': 3
            },
            {
                'title': 'AI & Machine Learning',
                'short_desc': 'Intelligent solutions that learn and adapt to your business needs.',
                'long_desc': 'Leverage the power of AI and machine learning to automate processes, gain insights from data, and create intelligent applications.',
                'category': 'ai',
                'features': [
                    'Custom ML model development',
                    'Data preprocessing and analysis',
                    'Natural language processing',
                    'Computer vision solutions',
                    'Predictive analytics',
                    'AI integration services'
                ],
                'order': 4
            },
            {
                'title': 'E-commerce Solutions',
                'short_desc': 'Complete e-commerce platforms that drive sales and growth.',
                'long_desc': 'Build your online store with our custom e-commerce solutions. We integrate payment gateways, inventory management, and marketing tools.',
                'category': 'web',
                'features': [
                    'Custom e-commerce platforms',
                    'Payment gateway integration',
                    'Inventory management',
                    'Order processing',
                    'Customer analytics',
                    'Marketing automation'
                ],
                'order': 5
            },
            {
                'title': 'API Development',
                'short_desc': 'Robust APIs that power your applications and integrations.',
                'long_desc': 'We design and build RESTful and GraphQL APIs that are scalable, secure, and well-documented for seamless integration.',
                'category': 'web',
                'features': [
                    'RESTful API design',
                    'GraphQL development',
                    'API documentation',
                    'Rate limiting and security',
                    'Testing and validation',
                    'Performance optimization'
                ],
                'order': 6
            },
            {
                'title': 'Cloud Migration',
                'short_desc': 'Seamlessly move your applications to the cloud.',
                'long_desc': 'Migrate your existing applications to modern cloud platforms with minimal downtime and maximum efficiency.',
                'category': 'devops',
                'features': [
                    'Cloud strategy planning',
                    'Application modernization',
                    'Data migration',
                    'Performance optimization',
                    'Cost optimization',
                    'Security implementation'
                ],
                'order': 7
            },
            {
                'title': 'Data Analytics',
                'short_desc': 'Transform your data into actionable business insights.',
                'long_desc': 'Build data pipelines, create dashboards, and implement analytics solutions that help you make informed decisions.',
                'category': 'ai',
                'features': [
                    'Data pipeline development',
                    'Business intelligence dashboards',
                    'Real-time analytics',
                    'Data visualization',
                    'Predictive modeling',
                    'Performance tracking'
                ],
                'order': 8
            },
            {
                'title': 'UI/UX Design',
                'short_desc': 'Beautiful, intuitive designs that enhance user experience.',
                'long_desc': 'Create engaging user interfaces and experiences that delight users and drive business results.',
                'category': 'web',
                'features': [
                    'User research and testing',
                    'Wireframing and prototyping',
                    'Visual design',
                    'Interaction design',
                    'Usability testing',
                    'Design system creation'
                ],
                'order': 9
            },
            {
                'title': 'Technical Consulting',
                'short_desc': 'Expert guidance for your technology decisions and strategy.',
                'long_desc': 'Get expert advice on technology choices, architecture decisions, and development strategies from our experienced team.',
                'category': 'consulting',
                'features': [
                    'Technology strategy',
                    'Architecture review',
                    'Code quality assessment',
                    'Performance optimization',
                    'Security audit',
                    'Team training'
                ],
                'order': 10
            }
        ]
        
        for data in services_data:
            Service.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
        
        self.stdout.write(f'✅ Created {len(services_data)} services')
    
    def create_testimonials(self):
        """Create demo testimonials."""
        self.stdout.write('💬 Creating testimonials...')
        
        testimonials_data = [
            {
                'client': 'Jennifer Martinez',
                'company': 'TechFlow Solutions',
                'quote': 'KKEVO transformed our outdated system into a modern, scalable platform. Their attention to detail and technical expertise exceeded our expectations.',
                'rating': 5,
                'order': 1
            },
            {
                'client': 'Robert Thompson',
                'company': 'InnovateCorp',
                'quote': 'Working with KKEVO was a game-changer for our startup. They delivered our MVP ahead of schedule and helped us iterate quickly based on user feedback.',
                'rating': 5,
                'order': 2
            },
            {
                'client': 'Amanda Foster',
                'company': 'Global Retail Inc',
                'quote': 'The e-commerce platform KKEVO built for us increased our online sales by 300% in the first year. Their team is professional, responsive, and truly understands business needs.',
                'rating': 5,
                'order': 3
            },
            {
                'client': 'Michael Chang',
                'company': 'DataSense Analytics',
                'quote': 'KKEVO helped us implement a comprehensive data analytics solution that provides real-time insights. Their AI expertise is world-class.',
                'rating': 5,
                'order': 4
            },
            {
                'client': 'Rachel Green',
                'company': 'HealthTech Innovations',
                'quote': 'The mobile app KKEVO developed for our healthcare platform is intuitive, secure, and compliant. They truly understand the healthcare industry.',
                'rating': 5,
                'order': 5
            },
            {
                'client': 'Daniel Wilson',
                'company': 'FinTech Pro',
                'quote': 'KKEVO delivered a robust financial platform that handles millions of transactions securely. Their DevOps practices ensure 99.9% uptime.',
                'rating': 5,
                'order': 6
            },
            {
                'client': 'Sophia Lee',
                'company': 'EduTech Solutions',
                'quote': 'Our learning management system built by KKEVO has revolutionized how we deliver education. The user experience is exceptional.',
                'rating': 5,
                'order': 7
            },
            {
                'client': 'Christopher Brown',
                'company': 'SmartCity Systems',
                'quote': 'KKEVO helped us build an IoT platform that manages city infrastructure. Their technical expertise and innovative thinking are outstanding.',
                'rating': 5,
                'order': 8
            }
        ]
        
        for data in testimonials_data:
            Testimonial.objects.get_or_create(
                client=data['client'],
                company=data['company'],
                defaults=data
            )
        
        self.stdout.write(f'✅ Created {len(testimonials_data)} testimonials')
    
    def create_blog_posts(self):
        """Create demo blog posts."""
        self.stdout.write('📝 Creating blog posts...')
        
        # Get team members for authors
        alex = TeamMember.objects.get(name='Alex Chen')
        sarah = TeamMember.objects.get(name='Sarah Johnson')
        marcus = TeamMember.objects.get(name='Marcus Rodriguez')
        emily = TeamMember.objects.get(name='Emily Watson')
        
        blog_data = [
            {
                'title': 'The Future of Web Development: What to Expect in 2024',
                'summary': 'Explore the latest trends and technologies that will shape web development in the coming year.',
                'body': '''
# The Future of Web Development: What to Expect in 2024

Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging constantly. As we approach 2024, several key trends are shaping the future of how we build and deploy web applications.

## 1. AI-Powered Development Tools

Artificial intelligence is revolutionizing how developers write code. From intelligent code completion to automated testing and debugging, AI tools are becoming indispensable for modern development teams.

### Key Benefits:
- Faster development cycles
- Reduced debugging time
- Improved code quality
- Automated testing

## 2. WebAssembly (WASM) Adoption

WebAssembly is gaining traction as a way to run high-performance code in the browser. This technology enables developers to write performance-critical parts of their applications in languages like C++, Rust, or Go.

### Use Cases:
- Video and audio processing
- 3D graphics and gaming
- Scientific computing
- Real-time data processing

## 3. Edge Computing and CDNs

The move toward edge computing is changing how we think about application architecture. By processing data closer to users, we can achieve lower latency and better performance.

## 4. Sustainable Web Development

Environmental consciousness is becoming a priority in web development. Developers are focusing on creating more energy-efficient applications and optimizing for sustainability.

## Conclusion

The future of web development is exciting and full of possibilities. By staying current with these trends and technologies, developers can build better, faster, and more sustainable web applications.
                ''',
                'author': alex,
                'tags': ['web development', 'trends', 'AI', 'WebAssembly'],
                'status': 'published',
                'published_at': timezone.now(),
                'is_featured': True
            },
            {
                'title': 'Building Scalable Microservices with Django and Docker',
                'summary': 'Learn how to design and implement scalable microservices using Django and Docker for modern applications.',
                'body': '''
# Building Scalable Microservices with Django and Docker

Microservices architecture has become the standard for building large-scale, maintainable applications. In this post, we'll explore how to implement microservices using Django and Docker.

## Understanding Microservices

Microservices are small, independent services that work together to form a complete application. Each service handles a specific business function and can be developed, deployed, and scaled independently.

## Django for Microservices

Django is an excellent choice for building microservices due to its:
- Rapid development capabilities
- Built-in admin interface
- Strong ORM
- Extensive ecosystem

## Docker Implementation

Docker provides the perfect environment for microservices by ensuring consistency across development, testing, and production environments.

### Key Benefits:
- Environment consistency
- Easy scaling
- Simplified deployment
- Resource isolation

## Best Practices

1. **Service Independence**: Each service should be completely independent
2. **API Design**: Use RESTful APIs for service communication
3. **Data Management**: Each service should have its own database
4. **Monitoring**: Implement comprehensive logging and monitoring

## Conclusion

Building microservices with Django and Docker provides a robust foundation for scalable applications. The key is to start small and gradually decompose your monolithic application.
                ''',
                'author': sarah,
                'tags': ['microservices', 'Django', 'Docker', 'architecture'],
                'status': 'published',
                'published_at': timezone.now(),
                'is_featured': False
            },
            {
                'title': 'Optimizing React Performance: A Comprehensive Guide',
                'summary': 'Discover advanced techniques for optimizing React applications and improving user experience.',
                'body': '''
# Optimizing React Performance: A Comprehensive Guide

Performance optimization is crucial for providing a smooth user experience in React applications. This guide covers essential techniques to improve your app's performance.

## 1. Code Splitting

Code splitting allows you to split your bundle into smaller chunks that can be loaded on demand.

```javascript
import React, { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 2. Memoization

Use React.memo and useMemo to prevent unnecessary re-renders:

```javascript
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

## 3. Virtual Scrolling

For large lists, implement virtual scrolling to render only visible items:

```javascript
import { FixedSizeList as List } from 'react-window';

const VirtualList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={35}
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index]}
      </div>
    )}
  </List>
);
```

## 4. Bundle Analysis

Use tools like webpack-bundle-analyzer to identify large dependencies:

```bash
npm install --save-dev webpack-bundle-analyzer
```

## Conclusion

Performance optimization is an ongoing process. Start with these fundamental techniques and continuously monitor your application's performance metrics.
                ''',
                'author': marcus,
                'tags': ['React', 'performance', 'optimization', 'frontend'],
                'status': 'published',
                'published_at': timezone.now(),
                'is_featured': True
            },
            {
                'title': 'Designing for Accessibility: Creating Inclusive User Experiences',
                'summary': 'Learn how to design and develop applications that are accessible to all users, including those with disabilities.',
                'body': '''
# Designing for Accessibility: Creating Inclusive User Experiences

Accessibility should be a fundamental consideration in every design and development project. Creating inclusive experiences ensures that all users can interact with your applications effectively.

## Why Accessibility Matters

Accessibility is not just about compliance—it's about creating better experiences for everyone. Approximately 15% of the world's population lives with some form of disability.

## Key Accessibility Principles

### 1. Perceivable
- Provide text alternatives for non-text content
- Ensure sufficient color contrast
- Support screen readers

### 2. Operable
- Make all functionality available from a keyboard
- Provide sufficient time to read and use content
- Avoid content that could cause seizures

### 3. Understandable
- Use clear and simple language
- Provide consistent navigation
- Help users avoid and correct mistakes

### 4. Robust
- Ensure compatibility with current and future tools
- Use semantic HTML
- Follow web standards

## Implementation Examples

### Semantic HTML
```html
<button aria-label="Close dialog">×</button>
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>
```

### ARIA Labels
```html
<div role="alert" aria-live="assertive">
  Your changes have been saved.
</div>
```

## Testing Accessibility

1. **Automated Testing**: Use tools like axe-core
2. **Manual Testing**: Test with keyboard navigation
3. **Screen Reader Testing**: Use tools like NVDA or VoiceOver
4. **User Testing**: Include users with disabilities in your testing

## Conclusion

Accessibility is an investment in creating better products for all users. Start implementing these practices early in your development process to ensure inclusive design from the beginning.
                ''',
                'author': emily,
                'tags': ['accessibility', 'UX design', 'inclusive design', 'web standards'],
                'status': 'published',
                'published_at': timezone.now(),
                'is_featured': False
            }
        ]
        
        for data in blog_data:
            BlogPost.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
        
        self.stdout.write(f'✅ Created {len(blog_data)} blog posts')
    
    def create_contact_submissions(self):
        """Create demo contact submissions."""
        self.stdout.write('📧 Creating contact submissions...')
        
        contact_data = [
            {
                'name': 'John Smith',
                'email': 'john.smith@example.com',
                'subject': 'project',
                'message': 'I\'m interested in developing a custom e-commerce platform for my business. Can we discuss the requirements and timeline?',
                'company': 'Smith Enterprises',
                'phone': '+1-555-0123'
            },
            {
                'name': 'Maria Garcia',
                'email': 'maria.garcia@techstartup.com',
                'subject': 'partnership',
                'message': 'We\'re looking for a technology partner to help us scale our platform. Would love to explore collaboration opportunities.',
                'company': 'TechStartup Inc',
                'phone': '+1-555-0456'
            },
            {
                'name': 'David Wilson',
                'email': 'david.wilson@consulting.com',
                'subject': 'consulting',
                'message': 'Need expert advice on migrating our legacy system to modern cloud infrastructure. Looking forward to your insights.',
                'company': 'Wilson Consulting',
                'phone': '+1-555-0789'
            },
            {
                'name': 'Lisa Anderson',
                'email': 'lisa.anderson@designstudio.com',
                'subject': 'general',
                'message': 'Your team\'s work looks impressive! I\'d like to learn more about your design process and capabilities.',
                'company': 'Anderson Design Studio',
                'phone': '+1-555-0321'
            }
        ]
        
        for data in contact_data:
            ContactSubmission.objects.get_or_create(
                name=data['name'],
                email=data['email'],
                defaults=data
            )
        
        self.stdout.write(f'✅ Created {len(contact_data)} contact submissions')
