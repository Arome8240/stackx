'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Settings, Wallet, LogOut, Moon, Sun, Zap } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { useCurrentUser, useLogout } from '@/lib/hooks/use-auth';
import { formatSTX } from '@/lib/utils';
import { useWallet } from '@/lib/hooks/use-wallet';

export function UserMenu() {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const { balance } = useWallet();

  if (!user) return null;

  const items = [
    {
      id: 'profile',
      label: 'View profile',
      icon: <User className="w-4 h-4" />,
      href: `/profile/${user.username}`,
    },
    {
      id: 'wallet',
      label: balance?.stx ? formatSTX(parseInt(balance.stx.balance ?? '0') / 1_000_000) + ' STX' : 'Wallet',
      icon: <Zap className="w-4 h-4" />,
      href: '/wallet',
    },
    { id: 'sep', separator: true },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      href: '/settings',
    },
    { id: 'sep2', separator: true },
    {
      id: 'logout',
      label: 'Log out',
      icon: <LogOut className="w-4 h-4" />,
      action: () => logout(),
      className: 'text-red-400',
    },
  ];

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors">
          <Avatar
            size="sm"
            src={user.avatarUrl}
            fallback={user.displayName ?? user.username}
            verified={user.tier === 2}
          />
        </button>
      }
      items={items}
      align="right"
    />
  );
}
