from django.core.management.base import BaseCommand
from django.utils import timezone
from blog.models import BlogCategory, BlogPost, BlogTag
from team.models import TeamMember
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Set up sample blog data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Setting up sample blog data...')
        
        # Create sample categories
        categories = [
            {'name': 'Technology', 'slug': 'technology', 'color': '#3B82F6', 'description': 'Technology and innovation topics'},
            {'name': 'Business', 'slug': 'business', 'color': '#10B981', 'description': 'Business and entrepreneurship'},
            {'name': 'Development', 'slug': 'development', 'color': '#F59E0B', 'description': 'Software development insights'},
            {'name': 'AI & ML', 'slug': 'ai-ml', 'color': '#EF4444', 'description': 'Artificial Intelligence and Machine Learning'},
        ]
        
        created_categories = []
        for cat_data in categories:
            category, created = BlogCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
            created_categories.append(category)
        
        # Create sample tags
        tags = [
            'Web Development', 'React', 'Python', 'Django', 'Next.js', 
            'JavaScript', 'TypeScript', 'AI', 'Machine Learning', 'Business'
        ]
        
        created_tags = []
        for tag_name in tags:
            tag, created = BlogTag.objects.get_or_create(
                name=tag_name,
                defaults={'slug': tag_name.lower().replace(' ', '-')}
            )
            if created:
                self.stdout.write(f'Created tag: {tag.name}')
            created_tags.append(tag)
        
        # Create sample team member if none exists
        author, created = TeamMember.objects.get_or_create(
            name='John Doe',
            defaults={
                'role': 'Lead Developer',
                'bio': 'Experienced software developer with expertise in modern web technologies.',
                'is_active': True,
                'order': 1
            }
        )
        if created:
            self.stdout.write(f'Created team member: {author.name}')
        
        # Create sample blog posts
        posts_data = [
            {
                'title': 'The Growing Influence of Mobile Apps in Everyday Life',
                'slug': 'the-growing-influence-of-mobile-apps-in-everyday-life',
                'excerpt': 'Explore how mobile applications are transforming the way we live, work, and interact in the digital age.',
                'body': '''
                Mobile applications have become an integral part of our daily lives, revolutionizing how we communicate, work, shop, and entertain ourselves. From social media platforms to productivity tools, mobile apps have transformed the digital landscape.

                ## The Rise of Mobile-First Design

                With the majority of internet users now accessing the web through mobile devices, businesses have shifted their focus to mobile-first design principles. This approach ensures that applications provide optimal user experiences across all screen sizes.

                ## Key Benefits of Mobile Apps

                - **Convenience**: Access to services anytime, anywhere
                - **Personalization**: Tailored experiences based on user preferences
                - **Offline Functionality**: Many apps work without internet connectivity
                - **Push Notifications**: Real-time updates and engagement

                ## Future Trends

                The future of mobile apps includes:
                - Artificial Intelligence integration
                - Augmented Reality experiences
                - Internet of Things connectivity
                - Enhanced security features

                As technology continues to evolve, mobile applications will play an even more significant role in shaping our digital future.
                ''',
                'category': created_categories[0],  # Technology
                'tags': ['Mobile Apps', 'Technology', 'Digital Transformation'],
                'status': 'published',
                'is_featured': True,
                'difficulty_level': 'beginner',
                'estimated_reading_time': 5
            },
            {
                'title': 'Building Scalable Web Applications with Django',
                'slug': 'building-scalable-web-applications-with-django',
                'excerpt': 'Learn the best practices for creating robust and scalable web applications using Django framework.',
                'body': '''
                Django is a powerful Python web framework that enables developers to build complex web applications quickly and efficiently. Its "batteries-included" approach provides everything needed for rapid development.

                ## Why Choose Django?

                Django offers several advantages for web development:
                - **Rapid Development**: Built-in admin interface and ORM
                - **Security**: Protection against common web vulnerabilities
                - **Scalability**: Handles high traffic and large datasets
                - **Community**: Extensive documentation and third-party packages

                ## Best Practices for Scalability

                ### Database Optimization
                - Use database indexes strategically
                - Implement query optimization
                - Consider database sharding for large applications

                ### Caching Strategies
                - Implement Redis caching for frequently accessed data
                - Use CDN for static assets
                - Leverage browser caching

                ### Code Organization
                - Follow Django's recommended project structure
                - Use class-based views for complex logic
                - Implement proper separation of concerns

                ## Performance Monitoring

                Monitor your application's performance using:
                - Django Debug Toolbar (development)
                - New Relic or similar APM tools (production)
                - Database query analysis
                - Response time monitoring

                By following these practices, you can build Django applications that scale effectively with your business growth.
                ''',
                'category': created_categories[2],  # Development
                'tags': ['Django', 'Python', 'Web Development', 'Scalability'],
                'status': 'published',
                'is_featured': False,
                'difficulty_level': 'intermediate',
                'estimated_reading_time': 8
            },
            {
                'title': 'The Future of Artificial Intelligence in Business',
                'slug': 'future-of-artificial-intelligence-in-business',
                'excerpt': 'Discover how AI is reshaping business operations and creating new opportunities across industries.',
                'body': '''
                Artificial Intelligence is no longer a futuristic concept—it's actively transforming how businesses operate and compete in today's market. From automation to predictive analytics, AI is becoming a cornerstone of modern business strategy.

                ## Current AI Applications in Business

                ### Customer Service
                - Chatbots and virtual assistants
                - Automated customer support
                - Personalized recommendations

                ### Data Analysis
                - Predictive analytics
                - Market trend analysis
                - Customer behavior insights

                ### Process Automation
                - Robotic Process Automation (RPA)
                - Intelligent document processing
                - Automated decision-making systems

                ## Benefits of AI Integration

                - **Increased Efficiency**: Automate repetitive tasks
                - **Better Decision Making**: Data-driven insights
                - **Cost Reduction**: Lower operational costs
                - **Improved Customer Experience**: Personalized interactions

                ## Implementation Challenges

                While AI offers tremendous benefits, businesses face several challenges:
                - Data quality and availability
                - Talent acquisition and training
                - Ethical considerations
                - Integration with existing systems

                ## Future Outlook

                The AI landscape is evolving rapidly, with new technologies emerging regularly. Businesses that embrace AI early will gain competitive advantages and be better positioned for future growth.

                Success in AI implementation requires:
                - Clear strategy and goals
                - Quality data infrastructure
                - Skilled team members
                - Continuous learning and adaptation
                ''',
                'category': created_categories[3],  # AI & ML
                'tags': ['AI', 'Machine Learning', 'Business', 'Automation'],
                'status': 'published',
                'is_featured': True,
                'difficulty_level': 'beginner',
                'estimated_reading_time': 6
            }
        ]
        
        for post_data in posts_data:
            post, created = BlogPost.objects.get_or_create(
                slug=post_data['slug'],
                defaults={
                    'title': post_data['title'],
                    'excerpt': post_data['excerpt'],
                    'body': post_data['body'],
                    'author': author,
                    'category': post_data['category'],
                    'tags': post_data['tags'],
                    'status': post_data['status'],
                    'is_featured': post_data['is_featured'],
                    'difficulty_level': post_data['difficulty_level'],
                    'estimated_reading_time': post_data['estimated_reading_time'],
                    'published_at': timezone.now()
                }
            )
            if created:
                self.stdout.write(f'Created blog post: {post.title}')
            else:
                self.stdout.write(f'Blog post already exists: {post.title}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully set up sample blog data!')
        )
        self.stdout.write(f'Created {len(created_categories)} categories')
        self.stdout.write(f'Created {len(created_tags)} tags')
        self.stdout.write(f'Created {len(posts_data)} blog posts')
