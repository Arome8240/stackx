import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { StacksProvider } from '@/components/providers/stacks-provider';
import { ToastProvider } from '@/components/ui/toast';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { RightSidebar } from '@/components/layout/right-sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'StackX', template: '%s · StackX' },
  description: 'The decentralized social platform built on Stacks. Own your feed, earn from your content.',
  keywords: ['decentralized social', 'stacks', 'bitcoin', 'web3', 'social media', 'NFT'],
  authors: [{ name: 'StackX' }],
  creator: 'StackX',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stackx.app',
    title: 'StackX',
    description: 'The decentralized social platform built on Stacks.',
    siteName: 'StackX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackX',
    description: 'The decentralized social platform built on Stacks.',
    creator: '@stackx',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#f4f4f5' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-primary/20">
        <StacksProvider>
          <ToastProvider>
            <div className="relative flex min-h-screen">
              {/* Left sidebar — hidden on mobile */}
              <Sidebar />

              {/* Main content */}
              <main className="flex-1 min-w-0 lg:ml-64 xl:mr-80">
                {children}
              </main>

              {/* Right sidebar — hidden below xl */}
              <RightSidebar />
            </div>

            {/* Mobile bottom nav */}
            <MobileNav />
          </ToastProvider>
        </StacksProvider>
      </body>
    </html>
  );
}
