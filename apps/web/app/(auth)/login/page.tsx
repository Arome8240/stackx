'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import { authApi } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { access_token } = await authApi.login(form);
      localStorage.setItem('token', access_token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white">Sign in to Staxial</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set('email')}
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={set('password')}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-center text-sm text-zinc-500">
          <Link href="/forgot-password" className="text-brand hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
