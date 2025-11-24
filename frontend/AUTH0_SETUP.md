# Auth0 Setup Instructions

## Frontend Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1

# Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_AUTH0_AUDIENCE=your_api_audience_here
```

## Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your_api_audience_here
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
```

## Auth0 Application Setup

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application or use existing one
3. Set application type to "Single Page Application"
4. Configure allowed callback URLs: `http://localhost:3000`
5. Configure allowed logout URLs: `http://localhost:3000`
6. Configure allowed web origins: `http://localhost:3000`

## Auth0 API Setup

1. Create a new API in Auth0
2. Set the identifier (audience) to your API URL
3. Enable RBAC (Role-Based Access Control)
4. Create a custom rule for admin roles:

```javascript
function (user, context, callback) {
  const namespace = 'https://kkevo.com/';
  context.idToken[namespace + 'roles'] = context.authorization.roles;
  context.accessToken[namespace + 'roles'] = context.authorization.roles;
  callback(null, user, context);
}
```

## Admin User Setup

1. Create a user in Auth0
2. Assign the user to an "admin" role
3. The user will automatically get admin access to the blog system

## Testing

1. Start the backend: `python manage.py runserver 8081`
2. Start the frontend: `npm run dev`
3. Navigate to the site and click "Sign In"
4. After authentication, admin users will see the "Admin" link in navigation
5. Non-admin users will not see the admin section







