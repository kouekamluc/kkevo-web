# 🔐 Complete Auth0 Setup Guide for KKEVO Company App

## 🚀 Quick Start (5 minutes)

### 1. **Copy Environment Files**
```bash
# Frontend
cd frontend
cp env.local.template .env.local

# Backend  
cd ../backend
cp env.template .env
```

### 2. **Update Auth0 Credentials**
Replace the placeholder values in your `.env.local` and `.env` files with your actual Auth0 credentials.

### 3. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
```

### 4. **Start Servers**
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver 8081

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🔧 Detailed Setup

### **Step 1: Auth0 Application Setup**

1. **Go to [Auth0 Dashboard](https://manage.auth0.com/)**
2. **Create Application:**
   - Name: `KKEVO Company App`
   - Type: **Single Page Application**
   - Click **Create**

3. **Configure Application Settings:**
   - **Allowed Callback URLs:** `http://localhost:3000,http://localhost:3001`
   - **Allowed Logout URLs:** `http://localhost:3000,http://localhost:3001`
   - **Allowed Web Origins:** `http://localhost:3000,http://localhost:3001`
   - Click **Save Changes**

4. **Copy Credentials:**
   - **Domain:** `dev-xxxxx.eu.auth0.com`
   - **Client ID:** `xxxxxxxxxxxxxxxxxxxxxxxx`

### **Step 2: Auth0 API Setup**

1. **Create API:**
   - Go to **APIs** → **Create API**
   - Name: `KKEVO Company API`
   - Identifier: `https://api.kkevo.com/company`
   - Signing Algorithm: **RS256**
   - Click **Create**

2. **Enable RBAC:**
   - In API settings, go to **Settings**
   - Enable **"Add Permissions in the Access Token"**
   - Enable **"Enable RBAC"**
   - Click **Save Changes**

3. **Create Roles:**
   - Go to **User Management** → **Roles**
   - Create Role: `admin`
   - Create Role: `staff`
   - Create Role: `user`

4. **Create Permissions:**
   - **Admin Role:**
     - `read:*`
     - `write:*`
     - `delete:*`
     - `manage:*`
   - **Staff Role:**
     - `read:*`
     - `write:blog_posts`
     - `write:services`
   - **User Role:**
     - `read:blog_posts`
     - `read:services`

### **Step 3: Environment Configuration**

#### **Frontend (.env.local)**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auth0 Configuration - REPLACE WITH YOUR VALUES
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.kkevo.com/company
```

#### **Backend (.env)**
```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
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
AUTH0_AUDIENCE=https://api.kkevo.com/company
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
```

### **Step 4: Create Admin User**

1. **Create User in Auth0:**
   - Go to **User Management** → **Users**
   - Click **Create User**
   - Email: `admin@kkevo.com`
   - Password: Choose strong password
   - Connection: `Username-Password-Authentication`
   - Click **Create**

2. **Assign Admin Role:**
   - Click on your new user
   - Go to **Roles** tab
   - Click **Assign Role**
   - Select the `admin` role
   - Click **Assign**

## 🧪 Testing the Setup

### **1. Test Backend API**
```bash
# Test public endpoint
curl http://localhost:8081/api/v1/auth/test/public/

# Test protected endpoint (should fail without auth)
curl http://localhost:8081/api/v1/auth/test/protected/

# Test admin endpoint (should fail without auth)
curl http://localhost:8081/api/v1/auth/test/admin/
```

### **2. Test Frontend Authentication**
1. Open `http://localhost:3000`
2. Click **"Sign In"** button
3. You should be redirected to Auth0 login
4. Log in with your admin credentials
5. You should see an **"Admin"** link in navigation

### **3. Test Admin Access**
1. Click the **"Admin"** link
2. You should see the admin dashboard
3. Try creating a new blog post
4. Try uploading an image

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **1. "Authentication not configured" Error**
- ✅ Check that `.env.local` exists in frontend directory
- ✅ Verify all Auth0 environment variables are set
- ✅ Restart the development server

#### **2. "Invalid token" Error**
- ✅ Check that Auth0 domain and audience match
- ✅ Verify the API identifier in Auth0 matches your audience
- ✅ Check that RBAC is enabled in Auth0 API settings

#### **3. "Permission denied" Error**
- ✅ Verify the user has the `admin` role assigned
- ✅ Check that the role has the required permissions
- ✅ Ensure the API audience matches between frontend and backend

#### **4. CORS Errors**
- ✅ Check that `CORS_ALLOWED_ORIGINS` includes your frontend URL
- ✅ Verify the backend is running on the correct port
- ✅ Check that the frontend is making requests to the correct backend URL

### **Debug Steps**

1. **Check Environment Variables:**
   ```bash
   # Frontend
   cd frontend
   cat .env.local
   
   # Backend
   cd backend
   cat .env
   ```

2. **Check Auth0 Configuration:**
   - Verify application settings in Auth0 dashboard
   - Check that callback URLs are correct
   - Ensure API audience matches

3. **Check Browser Console:**
   - Look for Auth0-related errors
   - Check network requests for authentication headers
   - Verify token is being stored

4. **Check Backend Logs:**
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

1. **Customize Roles:** Create additional roles for different user types
2. **Add Permissions:** Define granular permissions for different actions
3. **Implement User Management:** Add user registration, profile management
4. **Add Social Login:** Enable Google, GitHub, LinkedIn login options
5. **Implement MFA:** Add multi-factor authentication for admin users

## 🔒 Security Notes

- **Never commit `.env` files to version control**
- **Use strong, unique passwords for Auth0 accounts**
- **Enable MFA for production environments**
- **Regularly rotate client secrets**
- **Monitor Auth0 logs for suspicious activity**

---

## 🆘 Need Help?

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Verify all environment variables are set correctly**
3. **Ensure Auth0 application and API are configured properly**
4. **Check that both frontend and backend servers are running**
5. **Review browser console and backend logs for error messages**

The setup should work immediately once all credentials are properly configured!



