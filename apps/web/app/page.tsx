'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '../components/providers/wallet-provider';
import Button from '../components/ui/button';

const features = [
  {
    icon: '🏥',
    title: 'Patient Registry',
    desc: 'Register your identity on-chain. Your data stays encrypted — only the hash lives on Stacks.',
  },
  {
    icon: '📋',
    title: 'Medical Records',
    desc: 'Doctors write encrypted record pointers to IPFS. You control who can read them.',
  },
  {
    icon: '📅',
    title: 'Appointments',
    desc: 'Book, confirm, and manage appointments between patients and doctors on-chain.',
  },
  {
    icon: '🔐',
    title: 'Access Control',
    desc: "Grant or revoke a doctor's access to your records at any time — no middlemen.",
  },
];

export default function HomePage() {
  const { address, connect } = useWallet();
  const router = useRouter();

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Built on Stacks · Secured by Bitcoin
        </div>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Healthcare management, <span className="text-brand">decentralised</span>
        </h1>
        <p className="max-w-xl text-base text-zinc-400">
          HealthChain puts patients in control of their medical data using smart contracts on the
          Stacks blockchain. No central server. No data brokers.
        </p>
        <div className="flex gap-3">
          {address ? (
            <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          ) : (
            <Button onClick={connect}>Connect Wallet to Get Started</Button>
          )}
          <Button variant="outline" onClick={() => router.push('/about')}>
            Learn more
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3"
          >
            <span className="text-2xl">{f.icon}</span>
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
