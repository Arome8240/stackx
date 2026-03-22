'use client';

import Link from 'next/link';
import { useWallet } from '../providers/wallet-provider';
import Button from '../ui/button';

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function Navbar() {
  const { address, connect, disconnect } = useWallet();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-brand" aria-hidden="true">
            <path d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z" />
          </svg>
          <span className="text-sm font-bold tracking-tight">HealthChain</span>
        </Link>

        {/* Nav links — only shown when connected */}
        {address && (
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/appointments" className="hover:text-white transition">
              Appointments
            </Link>
            <Link href="/records" className="hover:text-white transition">
              Records
            </Link>
            <Link href="/doctors" className="hover:text-white transition">
              Doctors
            </Link>
          </nav>
        )}

        {/* Wallet */}
        <div className="flex items-center gap-3">
          {address ? (
            <>
              <span className="hidden rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 sm:block">
                {truncate(address)}
              </span>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
