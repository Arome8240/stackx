import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Staxial',
  description:
    'A Social DeFi platform built on the Stacks blockchain that combines social networking with decentralized finance primitives.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          {children}
        </main>
      </body>
    </html>
  );
}


