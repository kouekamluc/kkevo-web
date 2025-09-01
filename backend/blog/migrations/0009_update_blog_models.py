# Generated manually to update blog models - minimal version

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0008_fix_jsonfield_mismatch'),
    ]

    operations = [
        # Add missing fields to BlogCategory
        migrations.AddField(
            model_name='blogcategory',
            name='icon',
            field=models.CharField(max_length=50, blank=True, default=''),
        ),
        
        # Add missing fields to BlogPostView
        migrations.AddField(
            model_name='blogpostview',
            name='session_key',
            field=models.CharField(blank=True, max_length=40, default=''),
        ),
        
        # Add missing fields to BlogPostShare
        migrations.AddField(
            model_name='blogpostshare',
            name='share_type',
            field=models.CharField(choices=[('social', 'Social Media'), ('email', 'Email'), ('link', 'Direct Link'), ('embed', 'Embed')], max_length=20, default='social'),
        ),
        migrations.AddField(
            model_name='blogpostshare',
            name='user_agent',
            field=models.TextField(blank=True, default=''),
        ),
    ]
