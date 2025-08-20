"""
Management command to set up comprehensive company statistics.
"""
from django.core.management.base import BaseCommand
from services.models import CompanyStats


class Command(BaseCommand):
    help = 'Set up comprehensive company statistics'

    def handle(self, *args, **options):
        # Clear existing stats
        CompanyStats.objects.all().delete()
        
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
            },
            {
                'name': 'countries',
                'value': 25,
                'suffix': '+',
                'label': 'Countries Served',
                'description': 'Global reach across multiple continents and markets',
                'icon_name': 'globe',
                'color_scheme': 'from-teal-500 to-cyan-500',
                'order': 7,
                'is_active': True
            },
            {
                'name': 'team',
                'value': 500,
                'suffix': '+',
                'label': 'Team Members',
                'description': 'Skilled professionals dedicated to your success',
                'icon_name': 'users',
                'color_scheme': 'from-emerald-500 to-green-500',
                'order': 8,
                'is_active': True
            },
            {
                'name': 'users',
                'value': 1000000,
                'suffix': '+',
                'label': 'Users Impacted',
                'description': 'End users benefiting from our solutions worldwide',
                'icon_name': 'users',
                'color_scheme': 'from-violet-500 to-purple-500',
                'order': 9,
                'is_active': True
            }
        ]

        created_stats = []
        for stat_data in stats_data:
            stat = CompanyStats.objects.create(**stat_data)
            created_stats.append(stat)

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(created_stats)} company statistics')
        )
        
        for stat in created_stats:
            self.stdout.write(f'  - {stat.name}: {stat.value}{stat.suffix} ({stat.label})')
        
        self.stdout.write('\nCompany statistics are now available at /admin/services/companystats/')
        self.stdout.write('You can edit these values anytime from the Django admin interface.')
