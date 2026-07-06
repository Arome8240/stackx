'use client';

import * as React from 'react';
import { Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { api } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsProfilePage() {
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();

  const [form, setForm] = React.useState({
    displayName: '',
    bio: '',
    website: '',
    location: '',
  });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName ?? '',
        bio: user.bio ?? '',
        website: user.website ?? '',
        location: user.location ?? '',
      });
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.patch('/users/me', form);
      qc.invalidateQueries({ queryKey: ['me'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground">Profile Settings</h1>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar
              size="xl"
              src={user?.avatarUrl}
              fallback={user?.displayName ?? user?.username ?? '?'}
              verified={user?.tier === 2}
            />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div>
            <p className="font-medium text-foreground">{user?.displayName ?? user?.username}</p>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
            <p className="text-xs text-primary mt-1">Click the camera to change photo</p>
          </div>
        </div>

        <div className="grid gap-4">
          <Input
            label="Display name"
            value={form.displayName}
            onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
            maxLength={50}
            hint={`${form.displayName.length}/50`}
          />
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            maxLength={160}
            rows={3}
            hint={`${form.bio.length}/160`}
            placeholder="Tell the world about yourself…"
          />
          <Input
            label="Website"
            value={form.website}
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
            type="url"
            placeholder="https://yoursite.com"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            placeholder="City, Country"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          {saved && <p className="text-sm text-green-400">Profile saved!</p>}
          <div className="ml-auto">
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4" />
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
