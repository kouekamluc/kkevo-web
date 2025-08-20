import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/theme.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { CompanyConfigProvider } from '@/components/providers/CompanyConfigProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FloatingContactBubble } from '@/components/ui';
import PrefetchControl from '@/components/providers/PrefetchControl';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KKEVO - We Build Software That Moves Markets',
  description: 'KKEVO is a leading software development company specializing in custom web applications, mobile apps, and enterprise solutions.',
  keywords: 'software development, web applications, mobile apps, enterprise solutions, custom software',
  authors: [{ name: 'KKEVO Team' }],
  creator: 'KKEVO',
  publisher: 'KKEVO',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon-192x192.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kkevo.com',
    title: 'KKEVO - We Build Software That Moves Markets',
    description: 'KKEVO is a leading software development company specializing in custom web applications, mobile apps, and enterprise solutions.',
    siteName: 'KKEVO',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'KKEVO Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KKEVO - We Build Software That Moves Markets',
    description: 'KKEVO is a leading software development company specializing in custom web applications, mobile apps, and enterprise solutions.',
    images: ['/icon-512x512.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00D4FF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* DNS prefetch for API calls */}
        <link rel="dns-prefetch" href="//localhost" />
        <link rel="dns-prefetch" href="//127.0.0.1" />
        
        {/* Script to disable prefetching if API is not reachable */}
        <script
          id="prefetch-control"
          suppressHydrationWarning={true}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SmoothScrollProvider>
            <CompanyConfigProvider>
              <PrefetchControl />
              <Header />
              <main className="min-h-screen pt-16 lg:pt-20">
                {children}
              </main>
              <Footer />
              <FloatingContactBubble />
            </CompanyConfigProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
