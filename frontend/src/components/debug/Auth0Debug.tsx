'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export const Auth0Debug = () => {
  const [showDebug, setShowDebug] = useState(false);
  const auth = useAuth();

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
        >
          Debug Auth0
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Auth0 Debug Information</h2>
          <button
            onClick={() => setShowDebug(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Environment Variables */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Environment Variables</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono">
              <div>NEXT_PUBLIC_AUTH0_DOMAIN: {process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'NOT SET'}</div>
              <div>NEXT_PUBLIC_AUTH0_CLIENT_ID: {process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'NOT SET'}</div>
              <div>NEXT_PUBLIC_AUTH0_AUDIENCE: {process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'NOT SET'}</div>
              <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</div>
            </div>
          </div>

          {/* Auth0 State */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Auth0 State</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
              <div>isAuth0Configured: {auth.isAuth0Configured ? '✅ Yes' : '❌ No'}</div>
              <div>isAuthenticated: {auth.isAuthenticated ? '✅ Yes' : '❌ No'}</div>
              <div>isLoading: {auth.isLoading ? '✅ Yes' : '❌ No'}</div>
              <div>isAdmin: {auth.isAdmin ? '✅ Yes' : '❌ No'}</div>
              <div>Error: {auth.error ? auth.error.message : 'None'}</div>
            </div>
          </div>

          {/* Configuration Check */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Configuration Check</h3>
            <div className="space-y-2">
              <div className={`p-2 rounded ${process.env.NEXT_PUBLIC_AUTH0_DOMAIN && process.env.NEXT_PUBLIC_AUTH0_DOMAIN !== 'your-domain.auth0.com' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Domain: {process.env.NEXT_PUBLIC_AUTH0_DOMAIN && process.env.NEXT_PUBLIC_AUTH0_DOMAIN !== 'your-domain.auth0.com' ? '✅ Valid' : '❌ Invalid or placeholder'}
              </div>
              <div className={`p-2 rounded ${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID && process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID !== 'your_client_id_here' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Client ID: {process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID && process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID !== 'your_client_id_here' ? '✅ Valid' : '❌ Invalid or placeholder'}
              </div>
              <div className={`p-2 rounded ${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE && process.env.NEXT_PUBLIC_AUTH0_AUDIENCE !== 'your_api_audience_here' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Audience: {process.env.NEXT_PUBLIC_AUTH0_AUDIENCE && process.env.NEXT_PUBLIC_AUTH0_AUDIENCE !== 'your_api_audience_here' ? '✅ Valid' : '❌ Invalid or placeholder'}
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Test Actions</h3>
            <div className="space-x-2">
              <button
                onClick={() => auth.login()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Login
              </button>
              <button
                onClick={() => auth.logout()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Test Logout
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Troubleshooting Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Verify all environment variables are set (not placeholder values)</li>
              <li>Check Auth0 application settings match your URLs</li>
              <li>Ensure Auth0 API exists with correct identifier</li>
              <li>Verify RBAC is enabled in Auth0 API settings</li>
              <li>Check that user has admin role assigned</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};





