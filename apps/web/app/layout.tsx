import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staxial',
  description:
    'A Social DeFi platform built on the Stacks blockchain that combines social networking with decentralized finance primitives.',
  other: {
    'talentapp:project_verification':
      '82210c71536402a53da29e4729989fcd6eae087834f4c0e6d189c3f0ade7000bb1e364e4bdeeeec362e5bea2ee7098a020d070495f73ab6331a148d54041c174',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
