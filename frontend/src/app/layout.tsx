import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kkevo.com',
    title: 'KKEVO - We Build Software That Moves Markets',
    description: 'KKEVO is a leading software development company specializing in custom web applications, mobile apps, and enterprise solutions.',
    siteName: 'KKEVO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KKEVO - We Build Software That Moves Markets',
    description: 'KKEVO is a leading software development company specializing in custom web applications, mobile apps, and enterprise solutions.',
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
            <PrefetchControl />
            <Header />
            <main className="min-h-screen pt-16 lg:pt-20">
              {children}
            </main>
            <Footer />
            <FloatingContactBubble />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
