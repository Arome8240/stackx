'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to API reset endpoint
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Check your email</h1>
        <p className="text-sm text-zinc-400">
          If an account exists for <span className="text-white">{email}</span>, you&apos;ll receive
          a reset link shortly.
        </p>
        <Link
          href="/login"
          className="block text-center text-sm font-semibold text-white hover:underline"
        >
          Back to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white">Reset your password</h1>
      <p className="text-sm text-zinc-400">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" loading={loading}>
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/login" className="font-semibold text-white hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
