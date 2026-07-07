'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/lib/hooks/use-auth';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const resetPassword = useResetPassword();
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const passwordsMatch = password === confirm;
  const isValid = password.length >= 8 && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    resetPassword.mutate({ token, newPassword: password });
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
        {resetPassword.isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Password updated</h1>
              <p className="text-muted-foreground text-sm">You can now sign in with your new password.</p>
            </div>
            <Button className="w-full" size="lg" onClick={() => router.push('/login')}>
              Sign in
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold mb-1">Set a new password</h1>
              <p className="text-muted-foreground text-sm">Choose a new password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                hint="At least 8 characters"
                required
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                error={confirm && !passwordsMatch ? 'Passwords do not match' : undefined}
                required
              />

              {resetPassword.isError && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {resetPassword.error instanceof Error ? resetPassword.error.message : 'Reset failed'}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={resetPassword.isPending}
                disabled={!isValid}
                icon={<KeyRound className="w-4 h-4" />}
              >
                Reset password
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
