# KKEVO Website Deployment Guide

This guide covers deploying the KKEVO website to production environments.

## Prerequisites

- GitHub repository with admin access
- Vercel account for frontend hosting
- Railway/Render account for backend hosting
- AWS S3 bucket for media files (optional)
- Domain name (optional)

## Frontend Deployment (Vercel)

### 1. Connect Repository to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set the following configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Environment Variables

Set these environment variables in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_GTM_ID=your-google-tag-manager-id
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### 3. Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Backend Deployment (Railway)

### 1. Connect Repository to Railway

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository and set the root directory to `backend`

### 2. Environment Variables

Set these environment variables in Railway:

```env
DJANGO_SETTINGS_MODULE=core.settings.prod
SECRET_KEY=your-secure-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@your-domain.com

# AWS S3 (Optional)
USE_S3=True
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-s3-bucket-name

# Security
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

### 3. Database Setup

1. In Railway, go to "New" → "Database" → "PostgreSQL"
2. Wait for the database to be created
3. Copy the connection string to your environment variables
4. The database will be automatically migrated on first deployment

### 4. Custom Domain (Optional)

1. In Railway project settings, go to "Domains"
2. Add your custom domain (e.g., `api.your-domain.com`)
3. Update DNS records as instructed by Railway

## AWS S3 Setup (Optional)

### 1. Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket with your domain name
3. Enable public access (for static files)
4. Set bucket policy for public read access

### 2. IAM User

1. Create an IAM user with S3 access
2. Attach the `AmazonS3FullAccess` policy
3. Generate access keys
4. Add keys to Railway environment variables

## GitHub Actions Setup

### 1. Repository Secrets

Add these secrets to your GitHub repository:

- `RAILWAY_TOKEN`: Railway deployment token
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### 2. Enable Actions

1. Go to repository Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"
3. Save changes

## DNS Configuration

### 1. Root Domain

```
A     @     76.76.19.36
CNAME  www   cname.vercel-dns.com
```

### 2. API Subdomain

```
CNAME  api   your-railway-domain.railway.app
```

## Post-Deployment

### 1. Create Superuser

```bash
# Connect to Railway shell
railway shell

# Create superuser
python manage.py createsuperuser
```

### 2. Seed Demo Data

```bash
# In Railway shell
python manage.py seed_demo
```

### 3. Collect Static Files

```bash
# In Railway shell
python manage.py collectstatic --noinput
```

## Monitoring & Maintenance

### 1. Health Checks

- Frontend: Vercel automatically monitors uptime
- Backend: Railway health checks at `/api/v1/`

### 2. Logs

- Frontend: Vercel function logs
- Backend: Railway deployment logs

### 3. Performance

- Use Vercel Analytics for frontend metrics
- Monitor Railway resource usage
- Set up alerts for downtime

## Troubleshooting

### Common Issues

1. **Build Failures**: Check environment variables and dependencies
2. **Database Connection**: Verify DATABASE_URL format
3. **CORS Errors**: Ensure CORS_ALLOWED_ORIGINS includes your domain
4. **Static Files**: Check S3 configuration and permissions

### Rollback

1. **Frontend**: Use Vercel deployment history to rollback
2. **Backend**: Use Railway deployment history to rollback

## Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Regular dependency updates
- [ ] Monitoring and alerting configured

## Cost Optimization

### Vercel
- Use Hobby plan for small projects
- Monitor bandwidth usage
- Optimize images and assets

### Railway
- Monitor resource usage
- Use appropriate instance sizes
- Consider reserved instances for production

## Support

For deployment issues:
1. Check Railway and Vercel documentation
2. Review GitHub Actions logs
3. Check environment variable configuration
4. Verify DNS settings
5. Contact platform support if needed
