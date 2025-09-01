# Generated manually to fix JSONField mismatch

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0007_auto_20250825_2135'),
    ]

    operations = [
        migrations.RunSQL(
            # Forward SQL: Change json columns to text
            sql="""
            ALTER TABLE blog_blogpost 
            ALTER COLUMN related_services TYPE text USING related_services::text;
            
            ALTER TABLE blog_blogpost 
            ALTER COLUMN seo_keywords TYPE text USING seo_keywords::text;
            """,
            # Reverse SQL: Change text columns back to json (if needed)
            reverse_sql="""
            ALTER TABLE blog_blogpost 
            ALTER COLUMN related_services TYPE json USING related_services::json;
            
            ALTER TABLE blog_blogpost 
            ALTER COLUMN seo_keywords TYPE json USING seo_keywords::json;
            """
        ),
    ]



