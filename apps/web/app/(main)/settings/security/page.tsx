'use client';

import * as React from 'react';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';

export default function SecuritySettingsPage() {
  const [passwords, setPasswords] = React.useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const passwordsMatch = passwords.next === passwords.confirm;
  const isValid = passwords.current && passwords.next.length >= 8 && passwordsMatch;

  async function handleChangePassword() {
    setSaving(true);
    setError(null);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: '', next: '', confirm: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Security Settings
      </h1>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          Change Password
        </h2>
        <div className="grid gap-3">
          <Input
            label="Current password"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            autoComplete="current-password"
          />
          <Input
            label="New password"
            type="password"
            value={passwords.next}
            onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            autoComplete="new-password"
            hint="Minimum 8 characters"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            autoComplete="new-password"
            error={passwords.confirm && !passwordsMatch ? 'Passwords do not match' : undefined}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {success && <p className="text-sm text-green-400">Password changed successfully!</p>}

        <Button variant="primary" onClick={handleChangePassword} loading={saving} disabled={!isValid}>
          <Lock className="w-4 h-4" />
          Change Password
        </Button>
      </div>

      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-foreground">Active Sessions</h2>
        <p className="text-sm text-muted-foreground">You are currently signed in on this device.</p>
        <Button variant="destructive" size="sm">
          Sign out all other sessions
        </Button>
      </div>
    </div>
  );
}
