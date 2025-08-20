import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Analytics
  trackEvent: (eventName: string, eventData?: Record<string, any>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (token, user) => set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Analytics tracking
      trackEvent: (eventName: string, eventData?: Record<string, any>) => {
        // GTM event tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', eventName, eventData);
        }
        
        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
          console.log('GTM Event:', eventName, eventData);
        }
      },
    }),
    {
      name: 'kkevo-auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
