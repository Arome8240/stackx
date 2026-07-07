'use client';

import * as React from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/lib/hooks/use-auth';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword.mutate(email);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-2xl font-bold text-primary">StackX</span>
      </Link>

      <div className="w-full max-w-sm space-y-6">
        {forgotPassword.isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Check your email</h1>
              <p className="text-muted-foreground text-sm">
                If an account exists for <span className="text-foreground">{email}</span>, you'll receive a
                reset link shortly.
              </p>
            </div>
            <Link href="/login" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
              <p className="text-muted-foreground text-sm">Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" size="lg" loading={forgotPassword.isPending} icon={<Mail className="w-4 h-4" />}>
                Send reset link
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline font-medium">Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
