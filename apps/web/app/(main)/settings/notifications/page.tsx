'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

const DEFAULT_PREFS = {
  likes: true,
  recasts: true,
  replies: true,
  follows: true,
  tips: true,
  mentions: true,
  system: true,
  emailDigest: false,
  pushEnabled: false,
};

export default function SettingsNotificationsPage() {
  const [prefs, setPrefs, _] = useLocalStorage('notification-prefs', DEFAULT_PREFS);
  const [saved, setSaved] = React.useState(false);

  function toggle(key: keyof typeof DEFAULT_PREFS) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const groups = [
    {
      title: 'Activity',
      items: [
        { key: 'likes' as const, label: 'Likes', description: 'When someone likes your cast' },
        { key: 'recasts' as const, label: 'Recasts', description: 'When someone recasts your cast' },
        { key: 'replies' as const, label: 'Replies', description: 'When someone replies to your cast' },
        { key: 'mentions' as const, label: 'Mentions', description: 'When someone mentions you' },
      ],
    },
    {
      title: 'Social',
      items: [
        { key: 'follows' as const, label: 'New followers', description: 'When someone follows you' },
        { key: 'tips' as const, label: 'Tips received', description: 'When someone tips your cast' },
        { key: 'system' as const, label: 'System notifications', description: 'Platform updates and announcements' },
      ],
    },
    {
      title: 'Delivery',
      items: [
        { key: 'emailDigest' as const, label: 'Email digest', description: 'Weekly summary of your activity' },
        { key: 'pushEnabled' as const, label: 'Push notifications', description: 'Browser push notifications' },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        Notification Preferences
      </h1>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.title} className="glass rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <Switch
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  checked={prefs[item.key]}
                  onChange={() => toggle(item.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>
          {saved ? 'Saved!' : 'Save preferences'}
        </Button>
      </div>
    </div>
  );
}
