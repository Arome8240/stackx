import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { StacksProvider } from '@/components/providers/stacks-provider';

export const metadata: Metadata = {
  title: 'Staxial Health',
  description: 'Decentralized health management system on Stacks blockchain',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white antialiased">
        <StacksProvider>{children}</StacksProvider>
      </body>
    </html>
  );
}
