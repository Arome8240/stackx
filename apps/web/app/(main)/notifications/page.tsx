'use client';

import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data/users';

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'follow' as const,
    from: mockUsers[0],
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'like' as const,
    from: mockUsers[1],
    timestamp: '2024-01-20T09:15:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'recast' as const,
    from: mockUsers[2],
    timestamp: '2024-01-20T08:45:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'reply' as const,
    from: mockUsers[3],
    timestamp: '2024-01-19T22:30:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'mention' as const,
    from: mockUsers[4],
    timestamp: '2024-01-19T20:15:00Z',
    read: true,
  },
];

export default function NotificationsPage() {
  const getNotificationText = (type: string) => {
    switch (type) {
      case 'follow':
        return 'followed you';
      case 'like':
        return 'liked your cast';
      case 'recast':
        return 'recasted your cast';
      case 'reply':
        return 'replied to your cast';
      case 'mention':
        return 'mentioned you in a cast';
      default:
        return '';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return '👤';
      case 'like':
        return '❤️';
      case 'recast':
        return '🔁';
      case 'reply':
        return '💬';
      case 'mention':
        return '@';
      default:
        return '🔔';
    }
  };

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div>
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border-b border-border p-4 hover:bg-accent/50 transition-colors ${
              !notification.read ? 'bg-primary/5' : ''
            }`}
          >
            <div className="flex gap-3">
              <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link href={`/profile/${notification.from.username}`}>
                    <img
                      src={notification.from.avatar}
                      alt={notification.from.displayName}
                      className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/profile/${notification.from.username}`}
                      className="font-semibold hover:underline"
                    >
                      {notification.from.displayName}
                    </Link>
                    {notification.from.verified && (
                      <span className="text-primary ml-1">✓</span>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {getNotificationText(notification.type)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockNotifications.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-4xl mb-4">🔔</p>
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
