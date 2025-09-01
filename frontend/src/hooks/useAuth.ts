import { useAuth0 } from '@auth0/auth0-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Auth0User } from '@/lib/auth0';

// Create a wrapper hook that always calls useAuth0
const useAuth0Wrapper = () => {
  try {
    const auth0Data = useAuth0();
    
    // Log any errors from Auth0 for debugging
    if (auth0Data.error) {
      console.log('🔍 Auth0 Error Details:', {
        error: auth0Data.error,
        message: auth0Data.error.message,
        name: auth0Data.error.name,
        stack: auth0Data.error.stack,
        // Add more context
        isAuthenticated: auth0Data.isAuthenticated,
        isLoading: auth0Data.isLoading,
        hasUser: !!auth0Data.user
      });
    }
    
    return auth0Data;
  } catch (error) {
    console.error('🚨 useAuth0 hook failed:', error);
    // Return fallback data if useAuth0 fails
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: null,
      logout: () => {},
      getAccessTokenSilently: async () => '',
      error: null
    };
  }
};

export const useAuth = () => {
  // Check if Auth0 is available by looking for environment variables
  // Use a ref to track if we're on the client side to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [isAuth0Configured, setIsAuth0Configured] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check if Auth0 is properly configured - more robust validation
    const hasValidConfig = Boolean(
      process.env.NEXT_PUBLIC_AUTH0_DOMAIN && 
      process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID &&
      process.env.NEXT_PUBLIC_AUTH0_AUDIENCE &&
      process.env.NEXT_PUBLIC_AUTH0_DOMAIN.trim() !== '' &&
      process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID.trim() !== '' &&
      process.env.NEXT_PUBLIC_AUTH0_AUDIENCE.trim() !== ''
    );
    
    setIsAuth0Configured(hasValidConfig);
  }, []);

  // Use useRef to track if warning has been logged
  const warningLoggedRef = useRef(false);

  // Always call the wrapper hook
  const auth0Data = useAuth0Wrapper();

  // If Auth0 is not configured, override the data with fallback
  const finalAuth0Data = isAuth0Configured ? auth0Data : {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: null,
    logout: () => {},
    getAccessTokenSilently: async () => '',
    error: null
  };

  // Only log once per session to reduce console noise
  if (isClient && !isAuth0Configured && !warningLoggedRef.current) {
    console.info('🔐 Auth0 not configured - using fallback authentication. Set up environment variables to enable full authentication.');
    warningLoggedRef.current = true;
  }

  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error
  } = finalAuth0Data;

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return (user as Auth0User)['https://kkevo.com/roles']?.admin || false;
  }, [user]);

  const isStaff = useMemo(() => {
    if (!user) return false;
    return (user as Auth0User)['https://kkevo.com/roles']?.admin || false;
  }, [user]);

  const login = () => {
    if (!isAuth0Configured) {
      // Show a more helpful message with setup instructions
      const message = `🔐 Authentication Setup Required

To enable login functionality, please:

1. Create a .env.local file in the frontend directory
2. Add your Auth0 credentials:
   NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_AUTH0_AUDIENCE=your_api_audience_here

3. Restart the development server

📖 Complete setup guide: frontend/AUTH0_COMPLETE_SETUP.md

Contact your administrator for Auth0 account setup.`;
      
      alert(message);
      return;
    }

    try {
      // Log configuration for debugging
      console.log('Auth0 login attempt with config:', {
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
        clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        redirectUri: window.location.origin
      });

      // Test if we can access the Auth0 functions
      console.log('Auth0 functions available:', {
        loginWithRedirect: typeof loginWithRedirect,
        logout: typeof logout,
        getAccessTokenSilently: typeof getAccessTokenSilently
      });

      if (typeof loginWithRedirect === 'function') {
        console.log('Calling loginWithRedirect with proper audience and scope...');
        loginWithRedirect({
          appState: { returnTo: window.location.pathname },
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            scope: 'openid profile email read:blog write:blog'
          }
        });
        console.log('loginWithRedirect called successfully with audience and scope');
      } else {
        console.error('loginWithRedirect is not a function:', typeof loginWithRedirect);
        alert('Authentication is not configured. Please contact the administrator to set up login functionality.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Authentication is not configured. Please contact the administrator to set up login functionality.');
    }
  };

  const handleLogout = () => {
    if (!isAuth0Configured) {
      alert('Authentication is not configured. Please contact the administrator to set up login functionality.');
      return;
    }

    try {
      if (typeof logout === 'function') {
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      } else {
        alert('Authentication is not configured. Please contact the administrator to set up login functionality.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Authentication is not configured. Please contact the administrator to set up login functionality.');
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (!isAuth0Configured) {
      return null;
    }

    try {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        // Store token in localStorage for API client access
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth0_token', token);
        }
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    isAdmin,
    isStaff,
    login,
    logout: handleLogout,
    getAuthToken,
    error,
    isAuth0Configured
  };
};
