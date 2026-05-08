import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { StacksProvider } from '@/components/providers/stacks-provider';
import { Space_Grotesk, Space_Mono } from 'next/font/google';

const sans = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'StackX',
  description: 'A wallet-first social feed like Farcaster',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <StacksProvider>{children}</StacksProvider>
      </body>
    </html>
  );
}
