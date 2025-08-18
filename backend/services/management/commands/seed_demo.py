"""
Management command to seed demo data for KKEVO.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from services.models import Service, CompanyStats
from team.models import TeamMember
from testimonials.models import Testimonial
from portfolio.models import Portfolio
from blog.models import BlogPost
from contact.models import ContactSubmission
import json


class Command(BaseCommand):
    help = 'Seed the database with demo data for KKEVO project'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with demo data...')
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Service.objects.all().delete()
        CompanyStats.objects.all().delete()
        TeamMember.objects.all().delete()
        Testimonial.objects.all().delete()
        BlogPost.objects.all().delete()
        Portfolio.objects.all().delete()
        ContactSubmission.objects.all().delete()
        
        # Create services
        self.stdout.write('Creating services...')
        services_data = [
            {
                'title': 'Web Development',
                'short_desc': 'Modern, responsive web applications built with cutting-edge technologies.',
                'long_desc': 'We specialize in building scalable web applications using React, Next.js, Node.js, and Django. Our web solutions are optimized for performance, SEO, and user experience.',
                'category': 'web',
                'features': ['Responsive Design', 'SEO Optimization', 'Performance Tuning', 'Security Best Practices'],
                'order': 1,
                'is_active': True,
                'icon': 'web-development.svg'
            },
            {
                'title': 'Mobile Development',
                'short_desc': 'Native and cross-platform mobile applications for iOS and Android.',
                'long_desc': 'We develop high-performance mobile applications using React Native, Flutter, and native technologies. Our apps are designed for scalability and user engagement.',
                'category': 'mobile',
                'features': ['Cross-platform Development', 'Native Performance', 'Push Notifications', 'Offline Support'],
                'order': 2,
                'is_active': True,
                'icon': 'mobile-development.svg'
            },
            {
                'title': 'DevOps & Cloud',
                'short_desc': 'Infrastructure automation and cloud deployment solutions.',
                'long_desc': 'We help businesses modernize their infrastructure with automated CI/CD pipelines, containerization, and cloud-native solutions.',
                'category': 'devops',
                'features': ['CI/CD Pipelines', 'Container Orchestration', 'Infrastructure as Code', 'Monitoring & Alerting'],
                'order': 3,
                'is_active': True,
                'icon': 'devops-cloud.svg'
            },
            {
                'title': 'AI & Machine Learning',
                'short_desc': 'Intelligent solutions that drive business insights and automation.',
                'long_desc': 'We implement AI and ML solutions that help businesses make data-driven decisions and automate complex processes.',
                'category': 'ai',
                'features': ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'Recommendation Systems'],
                'order': 4,
                'is_active': True,
                'icon': 'ai-ml.svg'
            },
            {
                'title': 'Digital Consulting',
                'short_desc': 'Strategic guidance for digital transformation and technology adoption.',
                'long_desc': 'Our consulting services help businesses navigate digital transformation, choose the right technologies, and implement best practices.',
                'category': 'consulting',
                'features': ['Technology Strategy', 'Digital Transformation', 'Process Optimization', 'Team Training'],
                'order': 5,
                'is_active': True,
                'icon': 'consulting.svg'
            }
        ]
        
        for service_data in services_data:
            Service.objects.create(**service_data)
        
        # Create company stats
        self.stdout.write('Creating company statistics...')
        stats_data = [
            {
                'name': 'projects',
                'value': 150,
                'suffix': '+',
                'label': 'Projects Delivered',
                'description': 'Successfully completed projects across various industries',
                'icon_name': 'rocket',
                'color_scheme': 'from-blue-500 to-cyan-500',
                'order': 1,
                'is_active': True
            },
            {
                'name': 'clients',
                'value': 50,
                'suffix': '+',
                'label': 'Happy Clients',
                'description': 'Satisfied clients who trust us with their digital transformation',
                'icon_name': 'users',
                'color_scheme': 'from-green-500 to-emerald-500',
                'order': 2,
                'is_active': True
            },
            {
                'name': 'experience',
                'value': 8,
                'suffix': '+',
                'label': 'Years Experience',
                'description': 'Deep expertise in modern software development technologies',
                'icon_name': 'clock',
                'color_scheme': 'from-purple-500 to-pink-500',
                'order': 3,
                'is_active': True
            },
            {
                'name': 'satisfaction',
                'value': 99,
                'suffix': '%',
                'label': 'Client Satisfaction',
                'description': 'Consistently high satisfaction ratings from our clients',
                'icon_name': 'award',
                'color_scheme': 'from-yellow-500 to-orange-500',
                'order': 4,
                'is_active': True
            },
            {
                'name': 'support',
                'value': 24,
                'suffix': '/7',
                'label': 'Support Available',
                'description': 'Round-the-clock support for all our deployed solutions',
                'icon_name': 'zap',
                'color_scheme': 'from-red-500 to-pink-500',
                'order': 5,
                'is_active': True
            },
            {
                'name': 'technologies',
                'value': 15,
                'suffix': '+',
                'label': 'Technologies',
                'description': 'Cutting-edge technologies we master and implement',
                'icon_name': 'code',
                'color_scheme': 'from-indigo-500 to-violet-500',
                'order': 6,
                'is_active': True
            }
        ]
        
        for stat_data in stats_data:
            CompanyStats.objects.create(**stat_data)
        
        # Create team members
        self.stdout.write('Creating team members...')
        team_data = [
            {
                'name': 'Alex Chen',
                'role': 'ceo',
                'bio': 'Visionary leader with 15+ years in software development and business strategy.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/alexchen',
                    'github': 'https://github.com/alexchen',
                    'twitter': 'https://twitter.com/alexchen'
                },
                'order': 1,
                'is_active': True
            },
            {
                'name': 'Sarah Johnson',
                'role': 'cto',
                'bio': 'Technical architect and engineering leader with expertise in scalable systems.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/sarahjohnson',
                    'github': 'https://github.com/sarahjohnson'
                },
                'order': 2,
                'is_active': True
            },
            {
                'name': 'Marcus Rodriguez',
                'role': 'developer',
                'bio': 'Full-stack developer specializing in modern web technologies and cloud solutions.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/marcusrodriguez',
                    'github': 'https://github.com/marcusrodriguez'
                },
                'order': 3,
                'is_active': True
            },
            {
                'name': 'Emily Watson',
                'role': 'pm',
                'bio': 'Product strategist focused on user experience and business value delivery.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/emilywatson'
                },
                'order': 4,
                'is_active': True
            },
            {
                'name': 'David Kim',
                'role': 'devops',
                'bio': 'Infrastructure specialist with expertise in cloud platforms and automation.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/davidkim',
                    'github': 'https://github.com/davidkim'
                },
                'order': 5,
                'is_active': True
            },
            {
                'name': 'Lisa Rodriguez',
                'role': 'designer',
                'bio': 'Creative designer focused on user-centered design and accessibility.',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/lisarodriguez',
                    'dribbble': 'https://dribbble.com/lisarodriguez'
                },
                'order': 6,
                'is_active': True
            }
        ]
        
        for member_data in team_data:
            TeamMember.objects.create(**member_data)
        
        # Create testimonials
        self.stdout.write('Creating testimonials...')
        testimonials_data = [
            {
                'client': 'Sarah Johnson',
                'company': 'TechCorp Inc.',
                'quote': 'KKEVO transformed our entire digital infrastructure. Their team delivered a solution that exceeded our expectations in every way.',
                'rating': 5,
                'order': 1,
                'is_active': True
            },
            {
                'client': 'David Kim',
                'company': 'FinanceBank',
                'quote': 'Working with KKEVO was a game-changer for our mobile banking app. Their expertise in fintech and security gave us confidence.',
                'rating': 5,
                'order': 2,
                'is_active': True
            },
            {
                'client': 'Emily Watson',
                'company': 'DataFlow Systems',
                'quote': 'The AI analytics dashboard KKEVO built for us has revolutionized how we make business decisions.',
                'rating': 5,
                'order': 3,
                'is_active': True
            },
            {
                'client': 'Michael Chen',
                'company': 'CloudTech Solutions',
                'quote': 'KKEVO\'s cloud migration expertise saved us months of planning and implementation time.',
                'rating': 5,
                'order': 4,
                'is_active': True
            },
            {
                'client': 'Lisa Rodriguez',
                'company': 'Retail Innovations',
                'quote': 'The e-commerce platform KKEVO developed transformed our business model. We\'ve seen incredible growth.',
                'rating': 5,
                'order': 5,
                'is_active': True
            },
            {
                'client': 'Alex Thompson',
                'company': 'HealthTech Plus',
                'quote': 'KKEVO delivered a HIPAA-compliant healthcare platform that exceeded all our security requirements.',
                'rating': 5,
                'order': 6,
                'is_active': True
            },
            {
                'client': 'Rachel Green',
                'company': 'EduTech Solutions',
                'quote': 'Our learning management system built by KKEVO has improved student engagement by 300%.',
                'rating': 5,
                'order': 7,
                'is_active': True
            },
            {
                'client': 'Tom Wilson',
                'company': 'Manufacturing Corp',
                'quote': 'KKEVO\'s IoT solution has revolutionized our production monitoring and efficiency.',
                'rating': 5,
                'order': 8,
                'is_active': True
            }
        ]
        
        for testimonial_data in testimonials_data:
            Testimonial.objects.create(**testimonial_data)
        
        # Create portfolio projects
        self.stdout.write('Creating portfolio projects...')
        portfolio_data = [
            {
                'title': 'E-Commerce Platform Transformation',
                'description': 'Revolutionized a traditional retail business with a modern, scalable e-commerce solution.',
                'long_description': 'A comprehensive e-commerce solution that transformed a traditional retail business into a digital powerhouse. The platform features advanced search, personalized recommendations, and seamless payment integration.',
                'category': 'web',
                'client': 'TechCorp',
                'year': '2024',
                'technologies': ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
                'duration': '6 months',
                'team_size': '8 developers',
                'results': {
                    'revenue': '+240%',
                    'conversion': '+180%',
                    'users': '+320%',
                    'performance': '+85%'
                },
                'live_url': 'https://example.com',
                'is_featured': True,
                'order': 1,
                'status': 'published'
            },
            {
                'title': 'AI-Powered Analytics Dashboard',
                'description': 'Built an intelligent analytics platform that provides real-time insights and predictive analytics.',
                'long_description': 'An intelligent analytics platform that uses machine learning to provide actionable insights and predictive analytics for business intelligence.',
                'category': 'ai',
                'client': 'DataFlow',
                'year': '2024',
                'technologies': ['Python', 'TensorFlow', 'React', 'D3.js'],
                'duration': '8 months',
                'team_size': '12 developers',
                'results': {
                    'revenue': '+180%',
                    'conversion': '+150%',
                    'users': '+280%',
                    'performance': '+92%'
                },
                'github_url': 'https://github.com/example',
                'is_featured': True,
                'order': 2,
                'status': 'published'
            },
            {
                'title': 'Mobile Banking Application',
                'description': 'Developed a secure, feature-rich mobile banking app with biometric authentication.',
                'long_description': 'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
                'category': 'mobile',
                'client': 'FinanceBank',
                'year': '2024',
                'technologies': ['React Native', 'TypeScript', 'Firebase', 'Biometrics'],
                'duration': '10 months',
                'team_size': '15 developers',
                'results': {
                    'revenue': '+300%',
                    'conversion': '+220%',
                    'users': '+450%',
                    'performance': '+88%'
                },
                'live_url': 'https://example.com',
                'is_featured': True,
                'order': 3,
                'status': 'published'
            },
            {
                'title': 'Cloud Infrastructure Migration',
                'description': 'Migrated legacy systems to modern cloud infrastructure with automated deployment.',
                'long_description': 'Migrated legacy systems to modern cloud infrastructure with automated deployment pipelines and monitoring.',
                'category': 'devops',
                'client': 'CloudTech',
                'year': '2023',
                'technologies': ['AWS', 'Kubernetes', 'Terraform', 'Jenkins'],
                'duration': '4 months',
                'team_size': '6 developers',
                'results': {
                    'revenue': '+120%',
                    'conversion': '+90%',
                    'users': '+200%',
                    'performance': '+95%'
                },
                'is_featured': True,
                'order': 4,
                'status': 'published'
            }
        ]
        
        for project_data in portfolio_data:
            Portfolio.objects.create(**project_data)
        
        # Create blog posts
        self.stdout.write('Creating blog posts...')
        
        # Get team members for authors
        alex = TeamMember.objects.get(name='Alex Chen')
        sarah = TeamMember.objects.get(name='Sarah Johnson')
        marcus = TeamMember.objects.get(name='Marcus Rodriguez')
        emily = TeamMember.objects.get(name='Emily Watson')
        
        blog_data = [
            {
                'title': 'The Future of Web Development in 2024',
                'summary': 'Exploring the latest trends and technologies shaping the future of web development.',
                'body': 'Web development continues to evolve rapidly, with new frameworks, tools, and methodologies emerging constantly. In 2024, we\'re seeing a shift towards more performant, accessible, and maintainable web applications. The rise of WebAssembly, the continued dominance of React and Next.js, and the emergence of new CSS features are reshaping how we build for the web. Performance optimization has become paramount, with Core Web Vitals playing a crucial role in search rankings and user experience. Modern development practices emphasize component-based architecture, server-side rendering, and progressive enhancement. As we move forward, the line between web and native applications continues to blur, with Progressive Web Apps (PWAs) offering near-native experiences. The future is bright for web developers who embrace these new technologies and methodologies.',
                'tags': ['Web Development', 'React', 'Next.js', 'Trends'],
                'status': 'published',
                'is_featured': True,
                'author': alex,
                'published_at': timezone.now() - timedelta(days=30)
            },
            {
                'title': 'Building Scalable AI Applications',
                'summary': 'Best practices for developing and deploying AI applications at scale.',
                'body': 'Artificial Intelligence applications require careful consideration of scalability, performance, and maintainability. When building AI systems, it\'s essential to design with scalability in mind from the ground up. This includes implementing proper data pipelines, using efficient algorithms, and designing robust APIs. Model serving becomes critical as your user base grows, requiring strategies like model versioning, A/B testing, and canary deployments. Infrastructure considerations include GPU resource management, distributed training, and real-time inference. Data quality and monitoring are paramount - you need comprehensive logging, metrics collection, and alerting systems. Security and privacy must be built-in, not bolted on. The key to success is starting simple and iterating based on real-world usage patterns and feedback.',
                'tags': ['AI', 'Machine Learning', 'Scalability', 'Best Practices'],
                'status': 'published',
                'is_featured': True,
                'author': sarah,
                'published_at': timezone.now() - timedelta(days=20)
            },
            {
                'title': 'DevOps Best Practices for 2024',
                'summary': 'Essential DevOps practices for modern software development teams.',
                'body': 'DevOps has become essential for modern software development, enabling faster delivery and better quality. The key principles include automation, collaboration, and continuous improvement. Infrastructure as Code (IaC) using tools like Terraform and CloudFormation ensures consistent and reproducible environments. CI/CD pipelines automate testing, building, and deployment processes, reducing human error and increasing deployment frequency. Containerization with Docker and orchestration with Kubernetes provide portability and scalability. Monitoring and observability tools give teams visibility into application performance and infrastructure health. Security must be integrated throughout the pipeline, not treated as an afterthought. The goal is to create a culture of shared responsibility where development and operations teams work together seamlessly.',
                'tags': ['DevOps', 'CI/CD', 'Automation', 'Best Practices'],
                'status': 'published',
                'is_featured': False,
                'author': marcus,
                'published_at': timezone.now() - timedelta(days=10)
            },
            {
                'title': 'Mobile App Performance Optimization',
                'summary': 'Techniques for optimizing mobile app performance and user experience.',
                'body': 'Mobile app performance is crucial for user retention and satisfaction. Here are proven optimization techniques that can significantly improve your app\'s performance. Start with image optimization - use appropriate formats like WebP, implement lazy loading, and consider using vector graphics where possible. Implement efficient state management to minimize unnecessary re-renders and memory usage. Use code splitting and lazy loading to reduce initial bundle size. Implement proper caching strategies for both data and assets. Monitor and optimize network requests, using techniques like request batching and compression. Pay attention to battery usage by optimizing background processes and reducing unnecessary API calls. Test on real devices, not just simulators, as performance characteristics can vary significantly. Remember that performance is not just about speed - it\'s about creating a smooth, responsive user experience.',
                'tags': ['Mobile Development', 'Performance', 'React Native', 'Optimization'],
                'status': 'published',
                'is_featured': False,
                'author': emily,
                'published_at': timezone.now() - timedelta(days=5)
            }
        ]
        
        for post_data in blog_data:
            BlogPost.objects.create(**post_data)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded database with:\n'
                f'- {Service.objects.count()} services\n'
                f'- {CompanyStats.objects.count()} company stats\n'
                f'- {TeamMember.objects.count()} team members\n'
                f'- {Testimonial.objects.count()} testimonials\n'
                f'- {Portfolio.objects.count()} portfolio projects\n'
                f'- {BlogPost.objects.count()} blog posts'
            )
        )
