'use client';

import * as React from 'react';
import { Camera } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import type { User } from '@/lib/types/social';
import { api } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

interface EditProfileModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ user, open, onClose }: EditProfileModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = React.useState({
    displayName: user.displayName ?? '',
    bio: user.bio ?? '',
    website: user.website ?? '',
    location: user.location ?? '',
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.patch('/users/me', form);
      qc.invalidateQueries({ queryKey: ['profile', user.username] });
      qc.invalidateQueries({ queryKey: ['me'] });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar size="lg" src={user.avatarUrl} fallback={user.displayName ?? user.username} verified={user.tier === 2} />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user.displayName}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <Input
            label="Display name"
            value={form.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            maxLength={50}
          />
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            maxLength={160}
            rows={3}
            placeholder="Tell the world about yourself…"
          />
          <Input
            label="Website"
            value={form.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://"
            type="url"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, Country"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
