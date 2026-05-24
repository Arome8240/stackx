'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Repeat2, MessageCircle, UserPlus, Coins, AtSign, CheckCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { formatTimeAgo, formatSTX } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'all',      label: 'All' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'tips',     label: 'Tips' },
];

type NotifType = 'follow' | 'like' | 'recast' | 'reply' | 'mention' | 'tip';

interface MockNotif {
  id: string;
  type: NotifType;
  from: { username: string; displayName: string; avatar: string; verified: boolean };
  castSnippet?: string;
  amount?: number;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFS: MockNotif[] = [
  { id: '1', type: 'tip',     from: { username: 'punk6529', displayName: 'punk6529',     avatar: '', verified: false }, castSnippet: 'Bitcoin L2s are going to unlock...', amount: 5000000,  timestamp: new Date(Date.now() - 300000).toISOString(),  read: false },
  { id: '2', type: 'like',    from: { username: 'muneeb',   displayName: 'Muneeb Ali',   avatar: '', verified: true  }, castSnippet: 'Clarity\'s decidability property...', amount: undefined, timestamp: new Date(Date.now() - 600000).toISOString(),  read: false },
  { id: '3', type: 'follow',  from: { username: 'hiro_dev', displayName: 'Hiro Systems', avatar: '', verified: true  }, castSnippet: undefined, amount: undefined,             timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
  { id: '4', type: 'recast',  from: { username: 'alice',    displayName: 'Alice',        avatar: '', verified: false }, castSnippet: 'Hot take: Clarity is actually...', amount: undefined,  timestamp: new Date(Date.now() - 3600000).toISOString(), read: true  },
  { id: '5', type: 'reply',   from: { username: 'bob',      displayName: 'Bob',          avatar: '', verified: false }, castSnippet: 'Agreed! The static analysis guarantees...', amount: undefined, timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: '6', type: 'mention', from: { username: 'carol',    displayName: 'Carol',        avatar: '', verified: false }, castSnippet: 'Hey @you have you seen this?', amount: undefined,    timestamp: new Date(Date.now() - 14400000).toISOString(), read: true  },
  { id: '7', type: 'tip',     from: { username: 'dave',     displayName: 'Dave',         avatar: '', verified: false }, castSnippet: 'Bitcoin L2s are going to unlock...', amount: 2000000,  timestamp: new Date(Date.now() - 86400000).toISOString(), read: true  },
];

const iconMap: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  like:    { icon: <Heart    className="w-4 h-4 fill-current" />, color: 'text-red-500',    bg: 'bg-red-500/10' },
  recast:  { icon: <Repeat2  className="w-4 h-4" />,              color: 'text-green-500',  bg: 'bg-green-500/10' },
  reply:   { icon: <MessageCircle className="w-4 h-4" />,         color: 'text-primary',    bg: 'bg-primary/10' },
  follow:  { icon: <UserPlus className="w-4 h-4" />,              color: 'text-primary',    bg: 'bg-primary/10' },
  tip:     { icon: <Coins    className="w-4 h-4" />,              color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  mention: { icon: <AtSign   className="w-4 h-4" />,              color: 'text-primary',    bg: 'bg-primary/10' },
};

export default function NotificationsPage() {
  const [tab, setTab] = React.useState('all');
  const [notifs, setNotifs] = React.useState(MOCK_NOTIFS);

  const filtered = notifs.filter(n => {
    if (tab === 'mentions') return n.type === 'mention' || n.type === 'reply';
    if (tab === 'tips')     return n.type === 'tip';
    return true;
  });

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">Notifications</h1>
            {unread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" icon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="px-0" />
      </header>

      <div className="divide-y divide-border">
        {filtered.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up!" />
        ) : (
          filtered.map(n => <NotifItem key={n.id} notif={n} />)
        )}
      </div>
    </div>
  );
}

function NotifItem({ notif }: { notif: MockNotif }) {
  const meta = iconMap[notif.type];

  const message = {
    like:    'liked your cast',
    recast:  'recasted your cast',
    reply:   'replied to your cast',
    follow:  'started following you',
    tip:     `tipped you ${formatSTX(notif.amount ?? 0)}`,
    mention: 'mentioned you',
  }[notif.type];

  return (
    <div className={cn('flex gap-3 px-4 py-4 hover:bg-accent/30 transition-colors', !notif.read && 'bg-primary/[0.03]')}>
      {/* Notif icon */}
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', meta.bg, meta.color)}>
        {meta.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <Link href={`/profile/${notif.from.username}`}>
            <Avatar src={notif.from.avatar} alt={notif.from.displayName} size="sm" verified={notif.from.verified} />
          </Link>
          <div className="flex-1 min-w-0">
            <span className="text-sm">
              <Link href={`/profile/${notif.from.username}`} className="font-semibold hover:underline">
                {notif.from.displayName}
              </Link>{' '}
              <span className="text-muted-foreground">{message}</span>
            </span>
            {notif.castSnippet && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">"{notif.castSnippet}"</p>
            )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(notif.timestamp)}</span>
        </div>

        {notif.type === 'follow' && (
          <Button size="xs" variant="outline" className="mt-1">Follow back</Button>
        )}
        {notif.type === 'tip' && notif.amount && (
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-500">
            <Coins className="w-3 h-3" /> +{formatSTX(notif.amount)}
          </div>
        )}
      </div>

      {!notif.read && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
      )}
    </div>
  );
}
