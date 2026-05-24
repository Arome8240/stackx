'use client';

import * as React from 'react';
import {
  User, Bell, Shield, Palette, Wallet, LogOut,
  ChevronRight, Moon, Sun, Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'account',       label: 'Account',        icon: User,    description: 'Manage your profile and username' },
  { id: 'notifications', label: 'Notifications',  icon: Bell,    description: 'Control what alerts you receive' },
  { id: 'security',      label: 'Security',       icon: Shield,  description: 'Password, 2FA, connected apps' },
  { id: 'appearance',    label: 'Appearance',     icon: Palette, description: 'Theme, font size, display' },
  { id: 'wallet',        label: 'Wallet & Billing',icon: Wallet, description: 'Payment methods and subscriptions' },
];

type Theme = 'dark' | 'light' | 'system';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [theme, setTheme] = React.useState<Theme>('dark');
  const [notifs, setNotifs] = React.useState({
    likes: true, recasts: true, replies: true, follows: true, tips: true, mentions: true,
  });

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      {/* Profile summary */}
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <Avatar src={null} alt="Your Name" size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold">Your Name</p>
          <p className="text-sm text-muted-foreground">@yourusername</p>
        </div>
        <Badge variant="primary">Free</Badge>
      </div>

      {/* Nav sections */}
      <div className="divide-y divide-border">
        {SECTIONS.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => setActiveSection(activeSection === id ? null : id)}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-accent/30 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className={cn('w-4 h-4 text-muted-foreground transition-transform', activeSection === id && 'rotate-90')} />
          </button>
        ))}
      </div>

      {/* Expanded: Appearance */}
      {activeSection === 'appearance' && (
        <div className="border-t border-border p-4 space-y-4 animate-fade-in-up">
          <h3 className="font-semibold">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'dark',   label: 'Dark',   icon: <Moon    className="w-5 h-5" /> },
              { value: 'light',  label: 'Light',  icon: <Sun     className="w-5 h-5" /> },
              { value: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
            ] as { value: Theme; label: string; icon: React.ReactNode }[]).map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                  theme === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent',
                )}
              >
                {icon}
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expanded: Notifications */}
      {activeSection === 'notifications' && (
        <div className="border-t border-border p-4 space-y-1 animate-fade-in-up">
          <h3 className="font-semibold mb-3">Notifications</h3>
          {(Object.keys(notifs) as Array<keyof typeof notifs>).map(key => (
            <div key={key} className="flex items-center justify-between py-3">
              <span className="text-sm capitalize">{key}</span>
              <button
                onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                className={cn('w-11 h-6 rounded-full transition-colors', notifs[key] ? 'bg-primary' : 'bg-muted')}
              >
                <span className={cn('block w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-1', notifs[key] ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sign out */}
      <div className="p-4 border-t border-border mt-2">
        <Button variant="destructive" className="w-full" icon={<LogOut className="w-4 h-4" />}>
          Sign Out
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-4">StackX v2.0.0 · Built on Stacks Bitcoin L2</p>
      </div>
    </div>
  );
}
