"""
Management command to set up initial company configuration.
"""
from django.core.management.base import BaseCommand
from services.models import CompanyConfig


class Command(BaseCommand):
    help = 'Set up initial company configuration'

    def handle(self, *args, **options):
        if CompanyConfig.objects.exists():
            self.stdout.write(
                self.style.WARNING('Company configuration already exists. Skipping setup.')
            )
            return

        config = CompanyConfig.objects.create(
            hero_headline="We Build Software That Moves Markets",
            hero_subtitle="Transform your business with cutting-edge software solutions. From web applications to AI-powered systems, we deliver results that drive growth.",
            hero_features=[
                'Custom Software Development',
                'Web & Mobile Applications',
                'Cloud Infrastructure',
                'AI & Machine Learning',
            ],
            cta_headline="Ready to Transform Your Business?",
            cta_subtitle="Let's discuss how our innovative software solutions can drive growth, streamline operations, and create competitive advantages for your business.",
            cta_benefits=[
                'Free initial consultation and project assessment',
                'Transparent pricing with no hidden fees',
                'Dedicated project manager and development team',
                'Regular progress updates and milestone reviews',
                'Post-launch support and maintenance',
                'Scalable solutions that grow with your business',
            ],
            company_phone="+1 (555) 123-4567",
            company_email="hello@kkevo.com",
            company_address="123 Innovation Drive, Tech City, TC 12345",
            live_chat_enabled=True,
            trust_companies=['TechCorp', 'FinanceBank', 'DataFlow', 'InsightMetrics'],
            linkedin_url="https://linkedin.com/company/kkevo",
            twitter_url="https://twitter.com/kkevo",
            github_url="https://github.com/kkevo",
            is_active=True
        )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created company configuration with ID: {config.id}')
        )
        self.stdout.write('Company configuration is now available at /admin/services/companyconfig/')
