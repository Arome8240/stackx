import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { WalletProvider } from '../components/providers/wallet-provider';
import Navbar from '../components/layout/navbar';

export const metadata: Metadata = {
  title: 'HealthChain',
  description: 'Decentralised health and hospital management on the Stacks blockchain.',
  other: {
    'talentapp:project_verification':
      '82210c71536402a53da29e4729989fcd6eae087834f4c0e6d189c3f0ade7000bb1e364e4bdeeeec362e5bea2ee7098a020d070495f73ab6331a148d54041c174',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        <WalletProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
