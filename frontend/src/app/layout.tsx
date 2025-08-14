import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider';
import { FloatingContactBubble } from '@/components/ui';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KKEVO - Software Development Company | We Build Software That Moves Markets',
    template: '%s | KKEVO',
  },
  description: 'KKEVO is a leading software development company specializing in web development, mobile apps, cloud solutions, and digital transformation. We deliver cutting-edge software that drives business growth.',
  keywords: ['software development', 'web development', 'mobile apps', 'cloud solutions', 'digital transformation'],
  authors: [{ name: 'KKEVO Team' }],
  creator: 'KKEVO',
  publisher: 'KKEVO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kkevo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kkevo.com',
    siteName: 'KKEVO',
    title: 'KKEVO - Software Development Company',
    description: 'We Build Software That Moves Markets',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KKEVO - Software Development Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KKEVO - Software Development Company',
    description: 'We Build Software That Moves Markets',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <SmoothScrollProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e1b4b',
                  color: '#ffffff',
                },
              }}
            />
            <FloatingContactBubble />
            <ServiceWorkerProvider />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
