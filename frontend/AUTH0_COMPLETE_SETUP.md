# 🔐 Complete Auth0 Setup Guide

## 🚀 Quick Start

This guide will help you set up Auth0 authentication for the KKEVO blog system in under 10 minutes.

## 📋 Prerequisites

- Auth0 account (free tier available at [auth0.com](https://auth0.com))
- Basic understanding of environment variables

## 🔧 Step 1: Auth0 Application Setup

### 1.1 Create Auth0 Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Click **"Applications"** → **"Create Application"**
3. Name: `KKEVO Blog System`
4. Type: **Single Page Application**
5. Click **"Create"**

### 1.2 Configure Application Settings
1. In your application settings, update:
   - **Allowed Callback URLs**: `http://localhost:3000,http://localhost:3001`
   - **Allowed Logout URLs**: `http://localhost:3000,http://localhost:3001`
   - **Allowed Web Origins**: `http://localhost:3000,http://localhost:3001`
2. Click **"Save Changes"**

### 1.3 Copy Credentials
From your application settings, copy:
- **Domain** (e.g., `dev-abc123.us.auth0.com`)
- **Client ID** (e.g., `abc123def456ghi789`)

## 🔧 Step 2: Auth0 API Setup

### 2.1 Create API
1. Go to **"APIs"** → **"Create API"**
2. Name: `KKEVO Blog API`
3. Identifier: `https://api.kkevo.com/blog`
4. Signing Algorithm: **RS256**
5. Click **"Create"**

### 2.2 Enable RBAC
1. In your API settings, go to **"Settings"**
2. Enable **"Add Permissions in the Access Token"**
3. Enable **"Enable RBAC"**
4. Click **"Save Changes"**

### 2.3 Create Roles
1. Go to **"User Management"** → **"Roles"**
2. Click **"Create Role"**
3. Name: `admin`
4. Description: `Blog system administrator`
5. Click **"Create"**

### 2.4 Create Permissions
1. In the admin role, go to **"Permissions"**
2. Add these permissions:
   - `read:blog_posts`
   - `write:blog_posts`
   - `delete:blog_posts`
   - `manage:categories`
   - `upload:images`

## 🔧 Step 3: Frontend Environment Setup

### 3.1 Create .env.local
Create a file called `.env.local` in the `frontend` directory:

**Quick Setup Commands:**
```bash
# Windows PowerShell
cd frontend
Copy-Item env.example .env.local

# Linux/Mac
cd frontend
cp env.example .env.local
```

**Manual Creation:**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auth0 Configuration - REPLACE WITH YOUR VALUES
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.kkevo.com/blog

# Other settings...
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_GTM_ID=your-google-tag-manager-id
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### 3.2 Replace Placeholder Values
Replace the Auth0 values with your actual credentials:
- `your-domain.auth0.com` → Your Auth0 domain
- `your_client_id_here` → Your Auth0 client ID
- `https://api.kkevo.com/blog` → Your API audience

## 🔧 Step 4: Backend Environment Setup

### 4.1 Create .env
Create a file called `.env` in the `backend` directory:

**Quick Setup Commands:**
```bash
# Windows PowerShell
cd backend
Copy-Item env.example .env

# Linux/Mac
cd backend
cp env.example .env
```

**Manual Creation:**
```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
DJANGO_SETTINGS_MODULE=core.settings.dev

# Database Settings
DB_NAME=kkevo_db
DB_USER=kkevo_user
DB_PASSWORD=kkevo_password
DB_HOST=localhost
DB_PORT=5432

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Auth0 Configuration - REPLACE WITH YOUR VALUES
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://api.kkevo.com/blog
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here

# Other settings...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
DEFAULT_FROM_EMAIL=noreply@kkevo.com
```

### 4.2 Get Client Secret
1. In your Auth0 application settings
2. Go to **"Settings"** tab
3. Copy the **"Client Secret"**
4. Replace `your_client_secret_here` with this value

## 🔧 Step 5: Create Admin User

### 5.1 Create User in Auth0
1. Go to **"User Management"** → **"Users"**
2. Click **"Create User"**
3. Fill in:
   - Email: `admin@kkevo.com`
   - Password: Choose a strong password
   - Connection: `Username-Password-Authentication`
4. Click **"Create"**

### 5.2 Assign Admin Role
1. Click on your new user
2. Go to **"Roles"** tab
3. Click **"Assign Role"**
4. Select the `admin` role
5. Click **"Assign"**

## 🔧 Step 6: Test the Setup

### 6.1 Start Backend
```bash
cd backend
python manage.py runserver 8081
```

### 6.2 Start Frontend
```bash
cd frontend
npm run dev
```

### 6.3 Quick Test Commands
Test the authentication endpoints:

```bash
# Test public endpoint (should work)
curl http://localhost:8081/api/v1/auth/test/public/

# Test protected endpoint (should fail without auth)
curl http://localhost:8081/api/v1/auth/test/protected/

# Test admin endpoint (should fail without auth)
curl http://localhost:8081/api/v1/auth/test/admin/
```

### 6.3 Test Authentication
1. Open `http://localhost:3000`
2. Click **"Sign In"** button
3. You should be redirected to Auth0 login
4. Log in with your admin credentials
5. You should see an **"Admin"** link in the navigation

## 🔧 Step 7: Verify Permissions

### 7.1 Test Admin Access
1. Click the **"Admin"** link
2. You should see the blog dashboard
3. Try creating a new blog post
4. Try uploading an image

### 7.2 Test API Endpoints
1. Open browser dev tools
2. Go to Network tab
3. Try to access `/admin/blog`
4. Check that requests include `Authorization: Bearer <token>` header

## 🚨 Troubleshooting

### Common Issues

#### 1. "Authentication not configured" Error
- Check that `.env.local` exists in frontend directory
- Verify all Auth0 environment variables are set
- Restart the development server

#### 2. "Invalid token" Error
- Check that Auth0 domain and audience match
- Verify the API identifier in Auth0 matches your audience
- Check that RBAC is enabled in Auth0 API settings

#### 3. "Permission denied" Error
- Verify the user has the `admin` role assigned
- Check that the role has the required permissions
- Ensure the API audience matches between frontend and backend

#### 4. CORS Errors
- Check that `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Verify the backend is running on the correct port
- Check that the frontend is making requests to the correct backend URL

### Debug Steps

1. **Check Environment Variables**
   ```bash
   # Frontend
   cd frontend
   cat .env.local
   
   # Backend
   cd backend
   cat .env
   ```

2. **Check Auth0 Configuration**
   - Verify application settings in Auth0 dashboard
   - Check that callback URLs are correct
   - Ensure API audience matches

3. **Check Browser Console**
   - Look for Auth0-related errors
   - Check network requests for authentication headers
   - Verify token is being stored

4. **Check Backend Logs**
   - Look for authentication errors
   - Check that Auth0 authentication class is loaded
   - Verify user creation/authentication

## 📚 Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)
- [Django REST Framework Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- [JWT Token Debugger](https://jwt.io/)

## 🎯 Next Steps

Once authentication is working:

1. **Customize Roles**: Create additional roles for different user types
2. **Add Permissions**: Define granular permissions for different actions
3. **User Management**: Implement user registration and profile management
4. **Audit Logging**: Add logging for authentication events
5. **Security Hardening**: Implement additional security measures

## 🆘 Need Help?

If you're still experiencing issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check that Auth0 application and API are configured properly
4. Ensure the backend and frontend are running on correct ports
5. Check browser console and backend logs for specific error messages

The system is designed to work out of the box once properly configured. Most issues are related to environment variable configuration or Auth0 setup.
