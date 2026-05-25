'use client';

import * as React from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationItem } from '@/components/notifications/notification-item';
import { useNotifications, useMarkAllRead } from '@/lib/hooks/use-notifications';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
];

export default function NotificationsPage() {
  const [tab, setTab] = React.useState('all');
  const { data, isLoading } = useNotifications({ unreadOnly: tab === 'unread' });
  const markAllRead = useMarkAllRead();
  const notifications = data?.items ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-violet-400" />
          Notifications
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => markAllRead.mutate()}
          loading={markAllRead.isPending}
          disabled={notifications.every((n) => n.read)}
        >
          <Check className="w-4 h-4" />
          Mark all read
        </Button>
      </div>

      <div className="px-4 pt-3 pb-1">
        <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} />
      </div>

      <div className="divide-y divide-border/20">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description={tab === 'unread' ? "You're all caught up!" : "When people interact with your casts, you'll see it here"}
            className="py-16"
          />
        ) : (
          notifications.map((n) => <NotificationItem key={n._id} notification={n} />)
        )}
      </div>
    </div>
  );
}
