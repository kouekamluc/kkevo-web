import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  canInstall: boolean;
  isSupported: boolean;
}

interface NotificationPermission {
  permission: NotificationPermission;
  isSupported: boolean;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    canInstall: false,
    isSupported: false
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>({
    permission: 'default',
    isSupported: false
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check PWA support
  useEffect(() => {
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    setPwaState(prev => ({ ...prev, isSupported }));

    if (isSupported) {
      registerServiceWorker();
      checkInstallability();
      checkNotificationPermission();
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setPwaState(prev => ({ ...prev, hasUpdate: true }));
                showUpdateNotification();
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setPwaState(prev => ({ ...prev, hasUpdate: false }));
          window.location.reload();
        });

        console.log('Service Worker registered successfully');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, []);

  // Check if app can be installed
  const checkInstallability = useCallback(() => {
    if ('beforeinstallprompt' in window) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setPwaState(prev => ({ ...prev, canInstall: true }));
      });
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPwaState(prev => ({ ...prev, isInstalled: true }));
    }
  }, []);

  // Check notification permission
  const checkNotificationPermission = useCallback(() => {
    if ('Notification' in window) {
      setNotificationPermission({
        permission: Notification.permission,
        isSupported: true
      });
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    if (!registration || notificationPermission.permission !== 'granted') {
      toast.error('Please enable notifications first');
      return false;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Send subscription to backend
      await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      toast.success('Push notifications enabled!');
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error('Failed to enable push notifications');
      return false;
    }
  }, [registration, notificationPermission.permission]);

  // Unsubscribe from push notifications
  const unsubscribeFromPushNotifications = useCallback(async () => {
    if (!registration) return false;

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify backend
        await fetch('/api/v1/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });

        toast.success('Push notifications disabled');
        return true;
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast.error('Failed to disable push notifications');
      return false;
    }

    return false;
  }, [registration]);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!pwaState.canInstall) {
      toast.error('App cannot be installed');
      return false;
    }

    try {
      // Trigger install prompt
      const promptEvent = new Event('beforeinstallprompt');
      window.dispatchEvent(promptEvent);
      
      toast.success('Installation prompt triggered');
      return true;
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast.error('Failed to install app');
      return false;
    }
  }, [pwaState.canInstall]);

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if (!registration) return false;

    try {
      await registration.update();
      toast.success('Checking for updates...');
      return true;
    } catch (error) {
      console.error('Error updating service worker:', error);
      toast.error('Failed to check for updates');
      return false;
    }
  }, [registration]);

  // Skip waiting and reload
  const skipWaiting = useCallback(() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  // Show update notification
  const showUpdateNotification = useCallback(() => {
    toast(
      (t) => (
        <div className="flex items-center space-x-2">
          <span>New version available!</span>
          <button
            onClick={() => {
              skipWaiting();
              toast.dismiss(t.id);
            }}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      ),
      { duration: 10000 }
    );
  }, [skipWaiting]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (notificationPermission.permission !== 'granted') {
      toast.error('Please enable notifications first');
      return false;
    }

    try {
      const notification = new Notification('KKEVO Test Notification', {
        body: 'This is a test notification from KKEVO',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'test-notification'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
      return false;
    }
  }, [notificationPermission.permission]);

  // Get service worker version
  const getServiceWorkerVersion = useCallback(async () => {
    if (!registration) return null;

    try {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.version);
        };
        registration.active?.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2]);
      });
    } catch (error) {
      console.error('Error getting service worker version:', error);
      return null;
    }
  }, [registration]);

  // Check cache status
  const checkCacheStatus = useCallback(async () => {
    if (!('caches' in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const cacheStatus = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheStatus[cacheName] = keys.length;
      }

      return cacheStatus;
    } catch (error) {
      console.error('Error checking cache status:', error);
      return null;
    }
  }, []);

  // Clear all caches
  const clearAllCaches = useCallback(async () => {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      
      toast.success('All caches cleared');
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast.error('Failed to clear caches');
      return false;
    }
  }, []);

  return {
    // State
    pwaState,
    notificationPermission,
    registration,
    
    // Actions
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    installPWA,
    updateServiceWorker,
    skipWaiting,
    sendTestNotification,
    getServiceWorkerVersion,
    checkCacheStatus,
    clearAllCaches,
    
    // Utilities
    isSupported: pwaState.isSupported,
    isOnline: pwaState.isOnline,
    hasUpdate: pwaState.hasUpdate,
    canInstall: pwaState.canInstall,
    isInstalled: pwaState.isInstalled
  };
}



