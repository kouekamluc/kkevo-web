"""
Management command to create sample blog posts.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from team.models import TeamMember
from blog.models import BlogPost, BlogCategory
from django.utils import timezone
import uuid


class Command(BaseCommand):
    help = 'Create sample blog posts for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=3,
            help='Number of blog posts to create'
        )

    def handle(self, *args, **options):
        count = options['count']
        
        # Get or create a team member as author
        author, created = TeamMember.objects.get_or_create(
            name='John Doe',
            defaults={
                'role': 'Lead Developer',
                'bio': 'Experienced developer with passion for clean code',
                'social_links': {
                    'email': 'john@example.com',
                    'linkedin': 'https://linkedin.com/in/johndoe',
                    'twitter': 'https://twitter.com/johndoe'
                }
            }
        )
        
        if created:
            self.stdout.write(f'Created team member: {author.name}')
        
        # Get or create blog categories
        categories = []
        category_data = [
            {'name': 'Web Development', 'slug': 'web-development', 'color': 'bg-blue-500'},
            {'name': 'Mobile Apps', 'slug': 'mobile-apps', 'color': 'bg-green-500'},
            {'name': 'AI & ML', 'slug': 'ai-ml', 'color': 'bg-purple-500'},
        ]
        
        for cat_data in category_data:
            category, created = BlogCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Sample blog post content
        sample_posts = [
            {
                'title': 'Getting Started with React 18',
                'slug': 'getting-started-with-react-18',
                'excerpt': 'Learn the basics of React 18 and its new features including concurrent rendering and automatic batching.',
                'body': '''
# Getting Started with React 18

React 18 brings exciting new features that improve performance and user experience. In this post, we'll explore the key improvements and how to use them.

## What's New in React 18?

### Concurrent Rendering
Concurrent rendering allows React to work on multiple versions of your UI at the same time. This means React can interrupt, pause, and resume work as needed.

### Automatic Batching
React 18 automatically batches all state updates, regardless of where they originate from. This improves performance by reducing the number of re-renders.

## Getting Started

1. **Update React**: First, update to React 18
   ```bash
   npm install react@18 react-dom@18
   ```

2. **Enable Concurrent Features**: Use the new `createRoot` API
   ```jsx
   import { createRoot } from 'react-dom/client';
   
   const root = createRoot(document.getElementById('root'));
   root.render(<App />);
   ```

3. **Use New Hooks**: Take advantage of new hooks like `useTransition` and `useDeferredValue`

## Best Practices

- Always wrap your app with `createRoot`
- Use `useTransition` for non-urgent updates
- Leverage automatic batching for better performance

React 18 is a significant step forward for the React ecosystem, providing better performance and user experience out of the box.
                ''',
                'category': 'web-development',
                'tags': ['react', 'javascript', 'frontend', 'web-development'],
                'is_featured': True,
                'status': 'published'
            },
            {
                'title': 'Building Mobile Apps with React Native',
                'slug': 'building-mobile-apps-with-react-native',
                'excerpt': 'Discover how to build cross-platform mobile applications using React Native and modern development practices.',
                'body': '''
# Building Mobile Apps with React Native

React Native has revolutionized mobile app development by allowing developers to write once and deploy everywhere. Let's explore how to build robust mobile applications.

## Why React Native?

### Cross-Platform Development
Write your code once and deploy to both iOS and Android. This significantly reduces development time and cost.

### Native Performance
React Native compiles to native code, ensuring your apps perform just as well as native applications.

### Large Ecosystem
Access to thousands of third-party libraries and a vibrant community.

## Getting Started

1. **Install React Native CLI**
   ```bash
   npm install -g @react-native-community/cli
   ```

2. **Create a New Project**
   ```bash
   npx react-native init MyApp
   ```

3. **Run Your App**
   ```bash
   cd MyApp
   npx react-native run-android  # For Android
   npx react-native run-ios      # For iOS
   ```

## Key Components

- **View**: Basic building block for UI
- **Text**: Displays text content
- **Image**: Shows images
- **ScrollView**: Scrollable content
- **FlatList**: Efficient list rendering

## Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Optimize performance with `useMemo` and `useCallback`
- Test on both platforms regularly

React Native continues to evolve, making it easier than ever to build high-quality mobile applications.
                ''',
                'category': 'mobile-apps',
                'tags': ['react-native', 'mobile', 'cross-platform', 'javascript'],
                'is_featured': False,
                'status': 'published'
            },
            {
                'title': 'Introduction to Machine Learning',
                'slug': 'introduction-to-machine-learning',
                'excerpt': 'A beginner-friendly guide to machine learning concepts, algorithms, and practical applications.',
                'body': '''
# Introduction to Machine Learning

Machine Learning is transforming industries and creating new opportunities. Let's explore the fundamentals and get you started on your ML journey.

## What is Machine Learning?

Machine Learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.

## Types of Machine Learning

### Supervised Learning
Learning from labeled data to make predictions on new, unseen data.

### Unsupervised Learning
Finding patterns in data without predefined labels.

### Reinforcement Learning
Learning through interaction with an environment to maximize rewards.

## Popular Algorithms

1. **Linear Regression**: Predicts continuous values
2. **Logistic Regression**: Classifies data into categories
3. **Decision Trees**: Tree-like model for classification and regression
4. **Random Forest**: Ensemble of decision trees
5. **Neural Networks**: Deep learning models

## Getting Started with Python

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Load data
data = pd.read_csv('data.csv')

# Prepare features and target
X = data[['feature1', 'feature2']]
y = data['target']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
```

## Real-World Applications

- **Healthcare**: Disease diagnosis, drug discovery
- **Finance**: Fraud detection, risk assessment
- **E-commerce**: Recommendation systems
- **Transportation**: Self-driving cars, route optimization

## Getting Started

1. Learn Python fundamentals
2. Study mathematics (linear algebra, calculus, statistics)
3. Practice with datasets from Kaggle
4. Build simple projects
5. Join ML communities

Machine Learning is an exciting field with endless possibilities. Start with the basics and gradually build your expertise.
                ''',
                'category': 'ai-ml',
                'tags': ['machine-learning', 'python', 'ai', 'data-science'],
                'is_featured': True,
                'status': 'published'
            }
        ]
        
        created_count = 0
        for i, post_data in enumerate(sample_posts[:count]):
            # Find the category
            category_obj = next((cat for cat in categories if cat.slug == post_data['category']), None)
            
            # Create the blog post
            post, created = BlogPost.objects.get_or_create(
                slug=post_data['slug'],
                defaults={
                    'id': str(uuid.uuid4()),
                    'title': post_data['title'],
                    'excerpt': post_data['excerpt'],
                    'body': post_data['body'],
                    'author': author,
                    'new_category': category_obj,
                    'category': post_data['category'],
                    'tags': post_data['tags'],
                    'is_featured': post_data['is_featured'],
                    'status': post_data['status'],
                    'published_at': timezone.now(),
                    'estimated_reading_time': len(post_data['body'].split()) // 200 + 1,
                    'word_count': len(post_data['body'].split()),
                    'view_count': 0,
                    'like_count': 0,
                    'bookmark_count': 0,
                    'share_count': 0,
                    'comment_count': 0,
                    'related_services': '[]',  # Empty JSON array
                    'long_description': post_data['excerpt'],  # Use excerpt as long description
                    'seo_keywords': '[]',  # Empty JSON array
                    'seo_title': post_data['title'],
                    'seo_description': post_data['excerpt'],
                    'canonical_url': '',
                    'difficulty_level': 'beginner',
                    'reading_time': len(post_data['body'].split()) // 200 + 1
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created blog post: {post.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Blog post already exists: {post.title}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} blog posts')
        )
