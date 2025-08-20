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
                'pricing_tiers': {
                    'Basic': '$5,000',
                    'Pro': '$15,000',
                    'Enterprise': '$50,000+'
                },
                'timeline_estimates': {
                    'Basic': '4-6 weeks',
                    'Pro': '8-12 weeks',
                    'Enterprise': '16-24 weeks'
                },
                'budget_ranges': {
                    'Basic': '$3,000 - $8,000',
                    'Pro': '$10,000 - $25,000',
                    'Enterprise': '$30,000 - $100,000+'
                },
                'min_budget': 3000.00,
                'max_budget': 100000.00,
                'complexity_levels': ['Simple', 'Medium', 'Complex'],
                'deliverables': ['Source Code', 'Documentation', 'Deployment', 'Training'],
                'average_project_duration': '8-12 weeks',
                'success_rate': 95.5,
                'order': 1,
                'is_active': True,
                'is_featured': True,
                'icon': 'web-development.svg'
            },
            {
                'title': 'Mobile Development',
                'short_desc': 'Native and cross-platform mobile applications for iOS and Android.',
                'long_desc': 'We develop high-performance mobile applications using React Native, Flutter, and native technologies. Our apps are designed for scalability and user engagement.',
                'category': 'mobile',
                'features': ['Cross-platform Development', 'Native Performance', 'Push Notifications', 'Offline Support'],
                'pricing_tiers': {
                    'Basic': '$8,000',
                    'Pro': '$25,000',
                    'Enterprise': '$75,000+'
                },
                'timeline_estimates': {
                    'Basic': '6-8 weeks',
                    'Pro': '12-16 weeks',
                    'Enterprise': '20-32 weeks'
                },
                'budget_ranges': {
                    'Basic': '$5,000 - $12,000',
                    'Pro': '$15,000 - $35,000',
                    'Enterprise': '$40,000 - $120,000+'
                },
                'min_budget': 5000.00,
                'max_budget': 120000.00,
                'complexity_levels': ['Simple', 'Medium', 'Complex'],
                'deliverables': ['Source Code', 'App Store Submission', 'Documentation', 'Training'],
                'average_project_duration': '12-16 weeks',
                'success_rate': 92.0,
                'order': 2,
                'is_active': True,
                'is_featured': True,
                'icon': 'mobile-development.svg'
            },
            {
                'title': 'DevOps & Cloud',
                'short_desc': 'Infrastructure automation and cloud deployment solutions.',
                'long_desc': 'We help businesses modernize their infrastructure with automated CI/CD pipelines, containerization, and cloud-native solutions.',
                'category': 'devops',
                'features': ['CI/CD Pipelines', 'Container Orchestration', 'Infrastructure as Code', 'Monitoring & Alerting'],
                'pricing_tiers': {
                    'Basic': '$3,000',
                    'Pro': '$12,000',
                    'Enterprise': '$40,000+'
                },
                'timeline_estimates': {
                    'Basic': '2-4 weeks',
                    'Pro': '6-10 weeks',
                    'Enterprise': '12-20 weeks'
                },
                'budget_ranges': {
                    'Basic': '$2,000 - $6,000',
                    'Pro': '$8,000 - $20,000',
                    'Enterprise': '$25,000 - $60,000+'
                },
                'min_budget': 2000.00,
                'max_budget': 60000.00,
                'complexity_levels': ['Simple', 'Medium', 'Complex'],
                'deliverables': ['Infrastructure Setup', 'Documentation', 'Training', 'Support'],
                'average_project_duration': '6-10 weeks',
                'success_rate': 98.0,
                'order': 3,
                'is_active': True,
                'is_featured': False,
                'icon': 'devops-cloud.svg'
            },
            {
                'title': 'AI & Machine Learning',
                'short_desc': 'Intelligent solutions that drive business insights and automation.',
                'long_desc': 'We implement AI and ML solutions that help businesses make data-driven decisions and automate complex processes.',
                'category': 'ai',
                'features': ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'Recommendation Systems'],
                'pricing_tiers': {
                    'Basic': '$15,000',
                    'Pro': '$50,000',
                    'Enterprise': '$150,000+'
                },
                'timeline_estimates': {
                    'Basic': '8-12 weeks',
                    'Pro': '16-24 weeks',
                    'Enterprise': '24-40 weeks'
                },
                'budget_ranges': {
                    'Basic': '$10,000 - $25,000',
                    'Pro': '$30,000 - $75,000',
                    'Enterprise': '$80,000 - $200,000+'
                },
                'min_budget': 10000.00,
                'max_budget': 200000.00,
                'complexity_levels': ['Medium', 'Complex', 'Advanced'],
                'deliverables': ['AI Models', 'API Integration', 'Documentation', 'Training'],
                'average_project_duration': '16-24 weeks',
                'success_rate': 88.5,
                'order': 4,
                'is_active': True,
                'is_featured': True,
                'icon': 'ai-ml.svg'
            },
            {
                'title': 'Digital Consulting',
                'short_desc': 'Strategic guidance for digital transformation and technology adoption.',
                'long_desc': 'Our consulting services help businesses navigate digital transformation, choose the right technologies, and implement best practices.',
                'category': 'consulting',
                'features': ['Technology Strategy', 'Digital Transformation', 'Process Optimization', 'Team Training'],
                'pricing_tiers': {
                    'Basic': '$2,000',
                    'Pro': '$8,000',
                    'Enterprise': '$25,000+'
                },
                'timeline_estimates': {
                    'Basic': '1-2 weeks',
                    'Pro': '2-4 weeks',
                    'Enterprise': '4-8 weeks'
                },
                'budget_ranges': {
                    'Basic': '$1,500 - $4,000',
                    'Pro': '$5,000 - $15,000',
                    'Enterprise': '$15,000 - $50,000+'
                },
                'min_budget': 1500.00,
                'max_budget': 50000.00,
                'complexity_levels': ['Simple', 'Medium', 'Complex'],
                'deliverables': ['Strategy Document', 'Implementation Plan', 'Training', 'Follow-up'],
                'average_project_duration': '2-4 weeks',
                'success_rate': 97.0,
                'order': 5,
                'is_active': True,
                'is_featured': False,
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
                'name': 'Alex Johnson',
                'role': 'ceo',
                'bio': 'Visionary leader with 15+ years of experience in technology and business strategy. Passionate about innovation and building high-performing teams.',
                'experience_years': 15,
                'skills': ['Business Strategy', 'Team Leadership', 'Product Vision', 'Strategic Planning'],
                'skill_levels': {'Business Strategy': 'Expert', 'Team Leadership': 'Expert', 'Product Vision': 'Expert'},
                'certifications': ['MBA', 'PMP', 'Scrum Master'],
                'availability': 'available',
                'current_workload': 70,
                'max_workload': 100,
                'hourly_rate': 150.00,
                'email': 'alex@kkevo.com',
                'phone': '+1-555-0101',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/alexjohnson',
                    'twitter': 'https://twitter.com/alexjohnson'
                },
                'current_projects': ['Company Strategy', 'Client Relations'],
                'specializations': ['Business Development', 'Strategic Planning', 'Team Building'],
                'order': 1,
                'is_active': True
            },
            {
                'name': 'Sarah Chen',
                'role': 'cto',
                'bio': 'Technical leader with expertise in scalable architecture and emerging technologies. Drives innovation and technical excellence across all projects.',
                'experience_years': 12,
                'skills': ['System Architecture', 'Cloud Computing', 'DevOps', 'Python', 'React'],
                'skill_levels': {'System Architecture': 'Expert', 'Cloud Computing': 'Expert', 'DevOps': 'Advanced'},
                'certifications': ['AWS Solutions Architect', 'Google Cloud Professional', 'Kubernetes Administrator'],
                'availability': 'available',
                'current_workload': 85,
                'max_workload': 100,
                'hourly_rate': 140.00,
                'email': 'sarah@kkevo.com',
                'phone': '+1-555-0102',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/sarahchen',
                    'github': 'https://github.com/sarahchen'
                },
                'current_projects': ['Architecture Review', 'Technology Strategy'],
                'specializations': ['System Design', 'Cloud Architecture', 'Technical Leadership'],
                'order': 2,
                'is_active': True
            },
            {
                'name': 'Mike Rodriguez',
                'role': 'developer',
                'bio': 'Full-stack developer specializing in modern web technologies and performance optimization. Passionate about clean code and user experience.',
                'experience_years': 8,
                'skills': ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
                'skill_levels': {'React': 'Expert', 'Node.js': 'Advanced', 'Python': 'Advanced'},
                'certifications': ['React Developer', 'Node.js Developer', 'AWS Developer'],
                'availability': 'available',
                'current_workload': 60,
                'max_workload': 100,
                'hourly_rate': 95.00,
                'email': 'mike@kkevo.com',
                'phone': '+1-555-0103',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/mikerodriguez',
                    'github': 'https://github.com/mikerodriguez'
                },
                'current_projects': ['E-commerce Platform', 'Client Dashboard'],
                'specializations': ['Frontend Development', 'Backend Development', 'Performance Optimization'],
                'order': 3,
                'is_active': True
            },
            {
                'name': 'Emily Davis',
                'role': 'designer',
                'bio': 'Creative UI/UX designer focused on creating intuitive and beautiful user experiences. Expert in design systems and user research.',
                'experience_years': 6,
                'skills': ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'User Testing'],
                'skill_levels': {'UI Design': 'Expert', 'UX Research': 'Advanced', 'Figma': 'Expert'},
                'certifications': ['Google UX Design', 'Design Thinking'],
                'availability': 'available',
                'current_workload': 75,
                'max_workload': 100,
                'hourly_rate': 85.00,
                'email': 'emily@kkevo.com',
                'phone': '+1-555-0104',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/emilydavis',
                    'dribbble': 'https://dribbble.com/emilydavis'
                },
                'current_projects': ['Mobile App Design', 'Website Redesign'],
                'specializations': ['Mobile Design', 'Design Systems', 'User Research'],
                'order': 4,
                'is_active': True
            },
            {
                'name': 'David Kim',
                'role': 'devops',
                'bio': 'DevOps engineer specializing in automation, infrastructure as code, and cloud-native solutions. Expert in CI/CD and monitoring.',
                'experience_years': 7,
                'skills': ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Jenkins'],
                'skill_levels': {'Docker': 'Expert', 'Kubernetes': 'Advanced', 'Terraform': 'Expert'},
                'certifications': ['Docker Certified Associate', 'Kubernetes Administrator', 'AWS DevOps Engineer'],
                'availability': 'available',
                'current_workload': 80,
                'max_workload': 100,
                'hourly_rate': 100.00,
                'email': 'david@kkevo.com',
                'phone': '+1-555-0105',
                'social_links': {
                    'linkedin': 'https://linkedin.com/in/davidkim',
                    'github': 'https://github.com/davidkim'
                },
                'current_projects': ['Infrastructure Automation', 'CI/CD Pipeline'],
                'specializations': ['Infrastructure as Code', 'Cloud Architecture', 'Automation'],
                'order': 5,
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
                'title': 'E-commerce Platform Redesign',
                'description': 'Complete redesign of an existing e-commerce platform to improve user experience and increase conversions.',
                'long_description': 'This project involved redesigning a legacy e-commerce platform that was experiencing low conversion rates and poor user engagement. We implemented a modern, mobile-first design with improved navigation, faster checkout process, and enhanced product discovery features.',
                'category': 'web',
                'client': 'TechCorp Inc.',
                'year': '2024',
                'challenge': 'The existing platform had a 15% bounce rate, 2-minute average checkout time, and only 3% mobile conversion rate. Users were abandoning carts due to poor mobile experience and slow loading times.',
                'solution': 'We redesigned the entire platform with a mobile-first approach, implemented progressive web app features, optimized the checkout flow, and added AI-powered product recommendations.',
                'business_objectives': ['Increase Conversion Rate', 'Improve Mobile Experience', 'Reduce Cart Abandonment'],
                'roi_metrics': {
                    'revenue': '+150%',
                    'conversion_rate': '+85%',
                    'mobile_users': '+200%',
                    'checkout_time': '-60%',
                    'bounce_rate': '-70%'
                },
                'key_results': ['85% increase in conversion rate', '60% reduction in checkout time', '200% increase in mobile users'],
                'budget_range': '$75,000 - $120,000',
                'project_timeline': '16 weeks',
                'team_size': '6 developers',
                'duration': '4 months',
                'client_testimonial': 'The new platform exceeded our expectations. We saw immediate improvements in user engagement and a significant boost in sales. The mobile experience is now our competitive advantage.',
                'client_name': 'Sarah Johnson',
                'client_role': 'CTO',
                'client_company': 'TechCorp Inc.',
                'technologies': ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
                'hero_image': '',
                'gallery_images': [],
                'live_url': 'https://techcorp-store.com',
                'github_url': '',
                'case_study_url': '',
                'is_featured': True,
                'order': 1,
                'status': 'published'
            },
            {
                'title': 'AI-Powered Customer Service Bot',
                'description': 'Intelligent chatbot system that handles customer inquiries and reduces support ticket volume.',
                'long_description': 'We developed an AI-powered chatbot that can understand customer intent, provide accurate responses, and escalate complex issues to human agents. The system integrates with existing CRM and support systems.',
                'category': 'ai',
                'client': 'ServiceMax Solutions',
                'year': '2024',
                'challenge': 'Customer support team was overwhelmed with 500+ daily tickets, leading to 24-hour response times and customer dissatisfaction. Manual ticket routing was inefficient and error-prone.',
                'solution': 'We built a custom AI chatbot using natural language processing that can handle 80% of common inquiries automatically, with intelligent routing for complex cases.',
                'business_objectives': ['Reduce Support Tickets', 'Improve Response Time', 'Increase Customer Satisfaction'],
                'roi_metrics': {
                    'ticket_volume': '-60%',
                    'response_time': '-90%',
                    'customer_satisfaction': '+40%',
                    'support_cost': '-45%',
                    'agent_productivity': '+200%'
                },
                'key_results': ['60% reduction in support tickets', '90% faster response times', '45% cost savings'],
                'budget_range': '$45,000 - $75,000',
                'project_timeline': '12 weeks',
                'team_size': '4 developers',
                'duration': '3 months',
                'client_testimonial': 'The AI chatbot has transformed our customer service. We can now handle twice the volume with better response times and higher customer satisfaction scores.',
                'client_name': 'Michael Chen',
                'client_role': 'Head of Customer Success',
                'client_company': 'ServiceMax Solutions',
                'technologies': ['Python', 'TensorFlow', 'NLP', 'FastAPI', 'PostgreSQL'],
                'hero_image': '',
                'gallery_images': [],
                'live_url': '',
                'github_url': '',
                'case_study_url': '',
                'is_featured': True,
                'order': 2,
                'status': 'published'
            },
            {
                'title': 'DevOps Infrastructure Automation',
                'description': 'Complete infrastructure automation and CI/CD pipeline setup for a fintech startup.',
                'long_description': 'We automated the entire deployment pipeline for a fintech application, including infrastructure provisioning, testing, deployment, and monitoring. This enabled the team to deploy multiple times per day safely.',
                'category': 'devops',
                'client': 'FinTech Innovations',
                'year': '2023',
                'challenge': 'Manual deployment process took 4-6 hours, causing frequent production issues and preventing rapid feature releases. Infrastructure was inconsistent between environments.',
                'solution': 'Implemented Infrastructure as Code using Terraform, automated CI/CD with GitHub Actions, and set up comprehensive monitoring and alerting with Prometheus and Grafana.',
                'business_objectives': ['Reduce Deployment Time', 'Improve Reliability', 'Enable Rapid Releases'],
                'roi_metrics': {
                    'deployment_time': '-95%',
                    'production_incidents': '-80%',
                    'release_frequency': '+400%',
                    'infrastructure_cost': '-30%',
                    'developer_productivity': '+150%'
                },
                'key_results': ['95% reduction in deployment time', '80% fewer production incidents', '400% increase in release frequency'],
                'budget_range': '$25,000 - $45,000',
                'project_timeline': '8 weeks',
                'team_size': '3 developers',
                'duration': '2 months',
                'client_testimonial': 'The automation has been a game-changer. We can now deploy confidently multiple times per day, and our infrastructure is rock-solid. The cost savings alone made this project worthwhile.',
                'client_name': 'David Rodriguez',
                'client_role': 'DevOps Engineer',
                'client_company': 'FinTech Innovations',
                'technologies': ['Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus'],
                'hero_image': '',
                'gallery_images': [],
                'live_url': '',
                'github_url': '',
                'case_study_url': '',
                'is_featured': False,
                'order': 3,
                'status': 'published'
            }
        ]
        
        for project_data in portfolio_data:
            Portfolio.objects.create(**project_data)
        
        # Create blog posts
        self.stdout.write('Creating blog posts...')
        
        # Get team members for authors
        alex = TeamMember.objects.get(name='Alex Johnson')
        sarah = TeamMember.objects.get(name='Sarah Chen')
        mike = TeamMember.objects.get(name='Mike Rodriguez')
        emily = TeamMember.objects.get(name='Emily Davis')
        
        blog_data = [
            {
                'title': '10 Web Design Trends That Will Dominate 2024',
                'summary': 'Discover the latest web design trends that will shape the digital landscape in 2024 and beyond.',
                'body': 'The web design landscape is constantly evolving, driven by technological advancements and changing user expectations. In 2024, we\'re seeing several key trends that are reshaping how we approach digital experiences.\n\n1. **AI-Powered Personalization**\nArtificial intelligence is revolutionizing web design by enabling truly personalized user experiences. From dynamic content to intelligent recommendations, AI is making websites more engaging and relevant.\n\n2. **Micro-Interactions**\nSubtle animations and micro-interactions are becoming essential for creating engaging user experiences. These small details can significantly improve user engagement and satisfaction.\n\n3. **Dark Mode Design**\nDark mode has moved beyond just being a trend - it\'s now a user expectation. Implementing dark mode can improve accessibility and reduce eye strain.\n\n4. **Voice User Interface (VUI)**\nWith the rise of voice assistants, websites are beginning to incorporate voice navigation and search capabilities.\n\n5. **Progressive Web Apps (PWAs)**\nPWAs are blurring the line between websites and mobile apps, offering native app-like experiences through the browser.\n\n6. **3D Elements and Immersive Experiences**\nWebGL and Three.js are enabling 3D graphics and immersive experiences that were previously only possible in native applications.\n\n7. **Sustainability in Design**\nEco-friendly web design practices, such as optimized images and efficient code, are becoming more important to users and businesses.\n\n8. **Accessibility-First Design**\nDesigning for accessibility from the start is no longer optional - it\'s essential for reaching all users and complying with regulations.\n\n9. **Data Visualization**\nInteractive charts and data visualizations are making complex information more digestible and engaging.\n\n10. **Minimalist Design**\nClean, focused design that prioritizes content and functionality over decorative elements.\n\nThese trends represent the future of web design, where user experience, performance, and accessibility take center stage. As designers and developers, it\'s crucial to stay ahead of these trends to create websites that not only look great but also provide exceptional user experiences.',
                'category': 'design',
                'tags': ['Web Design', 'UI/UX', 'Trends', '2024', 'Design Systems'],
                'related_services': ['web-development', 'design'],
                'seo_title': '10 Web Design Trends 2024: Future of Digital Experiences',
                'seo_description': 'Discover the top 10 web design trends that will dominate 2024. Learn about AI personalization, micro-interactions, dark mode, and more.',
                'seo_keywords': ['web design trends', 'UI/UX design', 'digital design', 'web development', 'user experience'],
                'difficulty_level': 'intermediate',
                'view_count': 1250,
                'like_count': 89,
                'share_count': 45,
                'comment_count': 23,
                'is_featured': True,
                'status': 'published',
                'author': emily,
                'hero_image': 'blog/hero_images/web-design-trends-2024.jpg',
                'published_at': timezone.now() - timedelta(days=15)
            },
            {
                'title': 'Building Scalable APIs with Django REST Framework',
                'summary': 'Learn how to build robust, scalable APIs using Django REST Framework with best practices and real-world examples.',
                'body': 'Django REST Framework (DRF) is one of the most powerful tools for building APIs in Python. In this comprehensive guide, we\'ll explore how to create scalable, maintainable APIs that can handle high traffic and complex business logic.\n\n## Why Django REST Framework?\n\nDRF provides a robust foundation for building APIs with features like:\n- Serialization and validation\n- Authentication and permissions\n- ViewSets and routers\n- Filtering and pagination\n- Documentation generation\n\n## Project Structure\n\nA well-organized DRF project should follow this structure:\n```\napi/\n├── views/\n├── serializers/\n├── permissions/\n├── filters/\n└── tests/\n```\n\n## Best Practices for Scalability\n\n1. **Use ViewSets Wisely**\nViewSets can reduce code duplication, but don\'t overuse them. Sometimes a simple APIView is more appropriate.\n\n2. **Implement Proper Caching**\nUse Django\'s caching framework to reduce database queries and improve response times.\n\n3. **Database Optimization**\n- Use select_related() and prefetch_related()\n- Implement database indexing\n- Consider read replicas for high-traffic scenarios\n\n4. **API Versioning**\nImplement versioning from the start to maintain backward compatibility.\n\n5. **Rate Limiting**\nProtect your API from abuse with rate limiting and throttling.\n\n## Real-World Example\n\nHere\'s an example of a scalable API endpoint:\n```python\nclass UserViewSet(viewsets.ModelViewSet):\n    queryset = User.objects.all()\n    serializer_class = UserSerializer\n    permission_classes = [IsAuthenticated]\n    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]\n    filterset_fields = [\'is_active\', \'role\']\n    search_fields = [\'username\', \'email\', \'first_name\']\n    ordering_fields = [\'created_at\', \'username\']\n    ordering = [\'-created_at\']\n    \n    def get_queryset(self):\n        queryset = super().get_queryset()\n        if not self.request.user.is_staff:\n            queryset = queryset.filter(is_active=True)\n        return queryset.select_related(\'profile\').prefetch_related(\'groups\')\n```\n\n## Performance Monitoring\n\nImplement monitoring to track:\n- Response times\n- Database query performance\n- Memory usage\n- Error rates\n\n## Conclusion\n\nBuilding scalable APIs with DRF requires careful planning and implementation of best practices. Focus on performance, maintainability, and user experience to create APIs that can grow with your business needs.',
                'category': 'development',
                'tags': ['Django', 'API Development', 'Python', 'Backend', 'Performance'],
                'related_services': ['web-development', 'devops'],
                'seo_title': 'Scalable APIs with Django REST Framework: Complete Guide',
                'seo_description': 'Learn to build scalable APIs with Django REST Framework. Best practices, performance optimization, and real-world examples included.',
                'seo_keywords': ['django rest framework', 'api development', 'python backend', 'scalable apis', 'django'],
                'difficulty_level': 'advanced',
                'view_count': 890,
                'like_count': 67,
                'share_count': 34,
                'comment_count': 18,
                'is_featured': False,
                'status': 'published',
                'author': mike,
                'hero_image': 'blog/hero_images/django-rest-framework.jpg',
                'published_at': timezone.now() - timedelta(days=8)
            },
            {
                'title': 'The Future of AI in Business: 2024 and Beyond',
                'summary': 'Explore how artificial intelligence is transforming business operations and what to expect in the coming years.',
                'body': 'Artificial Intelligence is no longer a futuristic concept - it\'s actively transforming how businesses operate, make decisions, and serve their customers. As we move through 2024, AI adoption is accelerating across all industries.\n\n## Current State of AI in Business\n\nAI is already being used in various business applications:\n- **Customer Service**: Chatbots and virtual assistants\n- **Marketing**: Personalized campaigns and predictive analytics\n- **Operations**: Process automation and optimization\n- **Finance**: Fraud detection and risk assessment\n- **HR**: Recruitment and employee engagement\n\n## Key Trends for 2024\n\n1. **Generative AI Explosion**\nTools like ChatGPT and DALL-E are democratizing AI creation, enabling businesses to generate content, code, and designs more efficiently.\n\n2. **AI-Powered Decision Making**\nBusinesses are increasingly relying on AI to make data-driven decisions, from pricing strategies to resource allocation.\n\n3. **Hyper-Personalization**\nAI enables unprecedented levels of personalization in customer experiences, products, and services.\n\n4. **AI Ethics and Governance**\nAs AI becomes more prevalent, businesses are focusing on responsible AI development and deployment.\n\n## Implementation Strategies\n\n### Phase 1: Assessment and Planning\n- Identify AI opportunities in your business\n- Assess current data infrastructure\n- Define success metrics\n\n### Phase 2: Pilot Programs\n- Start with low-risk, high-impact projects\n- Build internal AI capabilities\n- Measure and iterate\n\n### Phase 3: Scale and Integration\n- Expand successful pilots\n- Integrate AI across business processes\n- Develop AI-first products and services\n\n## Challenges and Considerations\n\n1. **Data Quality**\nAI systems require high-quality, well-structured data to function effectively.\n\n2. **Talent Gap**\nThere\'s a shortage of AI talent, making it crucial to invest in training and development.\n\n3. **Ethical Concerns**\nBusinesses must address bias, privacy, and transparency in AI systems.\n\n4. **Integration Complexity**\nIntegrating AI with existing systems can be challenging and requires careful planning.\n\n## Future Outlook\n\nBy 2025, we expect to see:\n- **AI-First Companies**: Businesses built around AI from the ground up\n- **Autonomous Operations**: Self-managing systems that require minimal human intervention\n- **AI Collaboration**: Humans and AI working together more seamlessly\n- **Industry Transformation**: Entire industries being reshaped by AI adoption\n\n## Getting Started\n\n1. **Educate Your Team**\nProvide AI training and awareness programs\n\n2. **Start Small**\nBegin with simple AI applications and gradually increase complexity\n\n3. **Focus on Value**\nEnsure AI initiatives align with business objectives and deliver measurable value\n\n4. **Build Partnerships**\nCollaborate with AI vendors, consultants, and research institutions\n\nThe future of AI in business is bright, but success requires careful planning, ethical considerations, and a commitment to continuous learning and adaptation.',
                'category': 'ai-ml',
                'tags': ['Artificial Intelligence', 'Business Strategy', 'Digital Transformation', 'Innovation', 'Future of Work'],
                'related_services': ['ai', 'consulting'],
                'seo_title': 'AI in Business 2024: Future Trends and Implementation Guide',
                'seo_description': 'Discover how AI is transforming business in 2024. Learn implementation strategies, trends, and future outlook for artificial intelligence.',
                'seo_keywords': ['AI in business', 'artificial intelligence', 'business transformation', 'AI trends', 'digital innovation'],
                'difficulty_level': 'intermediate',
                'view_count': 2100,
                'like_count': 156,
                'share_count': 89,
                'comment_count': 45,
                'is_featured': True,
                'status': 'published',
                'author': sarah,
                'hero_image': 'blog/hero_images/ai-business-2024.jpg',
                'published_at': timezone.now() - timedelta(days=3)
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
