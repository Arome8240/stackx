import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { StacksProvider } from '@/components/providers/stacks-provider';

export const metadata: Metadata = {
  title: 'StackX',
  description: 'A wallet-first social feed like Farcaster',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <StacksProvider>{children}</StacksProvider>
      </body>
    </html>
  );
}
