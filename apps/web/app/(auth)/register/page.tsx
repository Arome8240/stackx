'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const STEPS = ['Connect', 'Profile', 'Follow'];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    username: '', displayName: '', bio: '', walletConnected: false,
  });
  const [followed, setFollowed] = React.useState<string[]>([]);

  const SUGGESTED = ['muneeb', 'satoshi_hiro', 'clarity_dev', 'punk6529'];

  const nextStep = async () => {
    if (step === STEPS.length - 1) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      toast({ type: 'success', title: 'Welcome to StackX!', description: 'Your account is ready.' });
      router.push('/');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow-sm">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-xl font-bold gradient-text">StackX</span>
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
        {/* Step 0: Connect wallet */}
        {step === 0 && (
          <>
            <div>
              <h2 className="text-xl font-bold mb-1">Connect your wallet</h2>
              <p className="text-sm text-muted-foreground">Your wallet is your identity on StackX.</p>
            </div>
            <div className="space-y-3">
              {['Leather Wallet', 'Hiro Wallet', 'Xverse'].map(w => (
                <button
                  key={w}
                  onClick={() => setForm(f => ({ ...f, walletConnected: true }))}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left',
                    form.walletConnected ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent',
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                    🦊
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{w}</p>
                    <p className="text-xs text-muted-foreground">Connect with {w}</p>
                  </div>
                  {form.walletConnected && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 1: Profile setup */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-xl font-bold mb-1">Set up your profile</h2>
              <p className="text-sm text-muted-foreground">Tell the community who you are.</p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Avatar src={null} alt={form.displayName || 'You'} size="2xl" />
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">+</button>
              </div>
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
                label="Display name"
                placeholder="Your Name"
                value={form.displayName}
                onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              />
              <Textarea
                label="Bio"
                placeholder="Tell everyone a bit about yourself…"
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                showCount
                maxLength={500}
              />
            </div>
          </>
        )}

        {/* Step 2: Follow suggestions */}
        {step === 2 && (
          <>
            <div>
              <h2 className="text-xl font-bold mb-1">Follow some people</h2>
              <p className="text-sm text-muted-foreground">Your feed will be populated from the people you follow.</p>
            </div>
            <div className="space-y-2">
              {SUGGESTED.map(u => (
                <div key={u} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <Avatar src={null} alt={u} size="sm" />
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

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          {step > 0 ? (
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(s => s - 1)}>
              Back
            </Button>
          ) : <div />}
          <Button
            size="md"
            loading={loading}
            disabled={step === 0 && !form.walletConnected}
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
