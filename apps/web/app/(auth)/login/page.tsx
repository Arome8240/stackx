'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [method, setMethod] = React.useState<'wallet' | 'email'>('wallet');
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [loading, setLoading] = React.useState(false);

  const handleWalletConnect = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast({ type: 'success', title: 'Wallet connected!', description: 'Redirecting to your feed…' });
    router.push('/');
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">StackX</span>
        </Link>

        <div className="w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue.</p>
          </div>

          {/* Method toggle */}
          <div className="flex rounded-xl border border-border p-1 bg-muted gap-1">
            {(['wallet', 'email'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                  method === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m === 'wallet' ? '🔐 Wallet' : '✉️ Email'}
              </button>
            ))}
          </div>

          {method === 'wallet' ? (
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                loading={loading}
                onClick={handleWalletConnect}
                icon={<Wallet className="w-5 h-5" />}
              >
                Connect Stacks Wallet
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Connect with Hiro Wallet, Leather, or Xverse
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">Supported wallets</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Leather', 'Hiro', 'Xverse'].map(w => (
                  <div key={w} className="rounded-lg border border-border p-3 text-center text-xs font-medium text-muted-foreground hover:bg-accent transition-colors cursor-pointer">
                    {w}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={loading} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Sign In
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right: visual panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-violet-950 via-purple-950 to-fuchsia-950 items-center justify-center p-12">
        <div className="max-w-sm space-y-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto">
            <Zap className="w-10 h-10 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Own your social graph</h2>
            <p className="text-white/60">StackX is a decentralized social platform built on Bitcoin L2. Your identity, your content, your earnings — all on-chain.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['42K+','Users'],['1.2M+','Casts'],['125 BTC','Tipped']].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-white/10 p-4">
                <p className="text-xl font-bold text-white">{v}</p>
                <p className="text-xs text-white/50">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
