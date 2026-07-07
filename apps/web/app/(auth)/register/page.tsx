'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useRegister } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';

const STEPS = ['Account', 'Follow'];

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({ username: '', email: '', password: '' });
  const [followed, setFollowed] = React.useState<string[]>([]);

  const SUGGESTED = ['muneeb', 'satoshi_hiro', 'clarity_dev', 'punk6529'];

  const canContinue = step === 0 ? form.username && form.email && form.password.length >= 8 : true;

  const nextStep = () => {
    if (step === STEPS.length - 1) {
      register.mutate(form, { onSuccess: () => router.push('/') });
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-xl font-bold text-primary">StackX</span>
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                i < step  ? 'bg-primary text-primary-foreground' :
                i === step ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                              'bg-muted text-muted-foreground'
              )}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn('text-xs hidden sm:block', i === step ? 'font-semibold' : 'text-muted-foreground')}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={cn('flex-1 h-0.5 w-8', i < step ? 'bg-primary' : 'bg-border')} />}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-card-lg space-y-5">
        {/* Step 0: Account */}
        {step === 0 && (
          <>
            <div>
              <h2 className="text-xl font-bold mb-1">Create your account</h2>
              <p className="text-sm text-muted-foreground">StackX creates and secures your Stacks wallet for you — no browser extension needed.</p>
            </div>
            <div className="flex justify-center">
              <Avatar src={null} fallback={form.username || 'You'} size="2xl" />
            </div>
            <div className="space-y-3">
              <Input
                label="Username"
                placeholder="yourname"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                hint="Letters, numbers, underscores only"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                hint="At least 8 characters"
              />
            </div>
          </>
        )}

        {/* Step 1: Follow suggestions */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-xl font-bold mb-1">Follow some people</h2>
              <p className="text-sm text-muted-foreground">Your feed will be populated from the people you follow.</p>
            </div>
            <div className="space-y-2">
              {SUGGESTED.map(u => (
                <div key={u} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <Avatar src={null} fallback={u} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">@{u}</p>
                  </div>
                  <Button
                    size="xs"
                    variant={followed.includes(u) ? 'success' : 'outline'}
                    onClick={() => setFollowed(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u])}
                  >
                    {followed.includes(u) ? 'Following ✓' : 'Follow'}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {register.isError && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {register.error instanceof Error ? register.error.message : 'Registration failed'}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          {step > 0 ? (
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(s => s - 1)}>
              Back
            </Button>
          ) : <div />}
          <Button
            size="md"
            loading={register.isPending}
            disabled={!canContinue}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={nextStep}
          >
            {step === STEPS.length - 1 ? 'Finish' : 'Continue'}
          </Button>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
}
