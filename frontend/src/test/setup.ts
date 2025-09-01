import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({})
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  }
}));

// Mock Next.js link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    img: ({ ...props }: any) => <img {...props} />,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    input: ({ ...props }: any) => <input {...props} />,
    textarea: ({ children, ...props }: any) => <textarea {...props}>{children}</textarea>,
    select: ({ children, ...props }: any) => <select {...props}>{children}</select>,
    option: ({ children, ...props }: any) => <option {...props}>{children}</option>,
    label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
    table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
    thead: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    td: ({ children, ...props }: any) => <td {...props}>{children}</td>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimationControls: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn()
  }),
  useMotionValue: (initial: any) => ({
    get: () => initial,
    set: vi.fn(),
    on: vi.fn()
  }),
  useTransform: (value: any, transform: any) => ({
    get: () => transform(value.get()),
    set: vi.fn(),
    on: vi.fn()
  })
}));

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn().mockReturnValue({ play: vi.fn(), pause: vi.fn(), reverse: vi.fn() }),
    from: vi.fn().mockReturnValue({ play: vi.fn(), pause: vi.fn(), reverse: vi.fn() }),
    fromTo: vi.fn().mockReturnValue({ play: vi.fn(), pause: vi.fn(), reverse: vi.fn() }),
    timeline: vi.fn().mockReturnValue({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      play: vi.fn(),
      pause: vi.fn(),
      reverse: vi.fn()
    }),
    set: vi.fn(),
    getProperty: vi.fn(),
    setProperty: vi.fn(),
    registerPlugin: vi.fn(),
    registerEffect: vi.fn()
  },
  Power2: { easeInOut: 'power2.easeInOut', easeOut: 'power2.easeOut', easeIn: 'power2.easeIn' },
  Power3: { easeInOut: 'power3.easeInOut', easeOut: 'power3.easeOut', easeIn: 'power3.easeIn' },
  Power4: { easeInOut: 'power4.easeInOut', easeOut: 'power4.easeOut', easeIn: 'power4.easeIn' },
  Back: { easeOut: 'back.easeOut', easeIn: 'back.easeIn', easeInOut: 'back.easeInOut' },
  Elastic: { easeOut: 'elastic.easeOut', easeIn: 'elastic.easeIn', easeInOut: 'elastic.easeInOut' },
  Bounce: { easeOut: 'bounce.easeOut', easeIn: 'bounce.easeIn', easeInOut: 'bounce.easeInOut' },
  Circ: { easeInOut: 'circ.easeInOut', easeOut: 'circ.easeOut', easeIn: 'circ.easeIn' },
  Sine: { easeInOut: 'sine.easeInOut', easeOut: 'sine.easeOut', easeIn: 'sine.easeIn' },
  Expo: { easeInOut: 'expo.easeInOut', easeOut: 'expo.easeOut', easeIn: 'expo.easeIn' }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  }
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    })),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  }
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock window.localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock window.fetch
global.fetch = vi.fn();

// Mock window.URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
});

// Mock window.URL.revokeObjectURL
Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock console methods in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console errors and warnings in tests
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8081/api/v1';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'test-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'test-client-id';
process.env.NEXT_PUBLIC_AUTH0_AUDIENCE = 'https://test-api.com';

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn(),
    getIdTokenClaims: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
    loginWithPopup: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    handleRedirectCallback: vi.fn(),
    checkSession: vi.fn(),
    buildAuthorizeUrl: vi.fn(),
    buildLogoutUrl: vi.fn(),
    parseHash: vi.fn(),
    getTokenSilently: vi.fn(),
    getTokenWithPopup: vi.fn(),
    getUser: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user: null
  }),
  Auth0Provider: ({ children }: any) => <>{children}</>,
  withAuthenticationRequired: (component: any) => component
}));

// Mock custom hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
    hasValidConfig: true
  })
}));

vi.mock('@/hooks/usePWA', () => ({
  usePWA: () => ({
    pwaState: {
      isInstalled: false,
      isOnline: true,
      hasUpdate: false,
      canInstall: false,
      isSupported: true
    },
    notificationPermission: {
      permission: 'default',
      isSupported: true
    },
    registration: null,
    requestNotificationPermission: vi.fn(),
    subscribeToPushNotifications: vi.fn(),
    unsubscribeFromPushNotifications: vi.fn(),
    installPWA: vi.fn(),
    updateServiceWorker: vi.fn(),
    skipWaiting: vi.fn(),
    sendTestNotification: vi.fn(),
    getServiceWorkerVersion: vi.fn(),
    checkCacheStatus: vi.fn(),
    clearAllCaches: vi.fn(),
    isSupported: true,
    isOnline: true,
    hasUpdate: false,
    canInstall: false,
    isInstalled: false
  })
}));

// Mock API functions
vi.mock('@/lib/api', () => ({
  blogApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    uploadImage: vi.fn()
  },
  servicesApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  teamApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  testimonialsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  contactApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  leadMagnetApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock components
vi.mock('@/components/ui', () => ({
  AnimatedButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  AnimatedCard: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  KkevoLogo: ({ ...props }: any) => <div {...props}>KKEVO</div>
}));

// Mock animations
vi.mock('@/components/animations', () => ({
  FadeInSection: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  StaggerList: ({ children, ...props }: any) => <div {...props}>{children}</div>
}));

// Setup test utilities
export const mockApiResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {},
  request: {}
});

export const mockApiError = (message: string, status = 500) => ({
  response: {
    data: { message },
    status,
    statusText: 'Error',
    headers: {},
    config: {},
    request: {}
  },
  message,
  isAxiosError: true
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'https://example.com/avatar.jpg',
  sub: 'auth0|test-user-id',
  ...overrides
});

export const createMockBlogPost = (overrides = {}) => ({
  id: 'test-post-id',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'This is a test blog post excerpt',
  body: 'This is the full body of the test blog post',
  status: 'published',
  published_at: new Date().toISOString(),
  author: createMockUser(),
  ...overrides
});

export const createMockService = (overrides = {}) => ({
  id: 'test-service-id',
  name: 'Test Service',
  description: 'This is a test service description',
  icon: 'test-icon',
  order: 1,
  ...overrides
});

export const createMockTeamMember = (overrides = {}) => ({
  id: 'test-member-id',
  name: 'Test Team Member',
  role: 'Developer',
  bio: 'This is a test team member bio',
  avatar: 'https://example.com/avatar.jpg',
  order: 1,
  ...overrides
});

export const createMockTestimonial = (overrides = {}) => ({
  id: 'test-testimonial-id',
  name: 'Test Client',
  company: 'Test Company',
  content: 'This is a test testimonial content',
  rating: 5,
  avatar: 'https://example.com/avatar.jpg',
  order: 1,
  ...overrides
});

// Export test utilities
export * from '@testing-library/react';
export { vi as test } from 'vitest';


