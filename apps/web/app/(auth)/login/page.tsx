'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/lib/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [form, setForm] = React.useState({ email: '', password: '' });

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form, { onSuccess: () => router.push('/') });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold text-primary">StackX</span>
        </Link>

        <div className="w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue.</p>
          </div>

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
            <Button type="submit" className="w-full" size="lg" loading={login.isPending} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right: visual panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-12">
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
