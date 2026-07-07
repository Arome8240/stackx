'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, Wallet, LogOut, Moon, Sun } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { useCurrentUser, useLogout } from '@/lib/hooks/use-auth';
import { formatSTX } from '@/lib/utils';
import { useWallet } from '@/lib/hooks/use-wallet';
import { useThemeTransition } from '@/lib/hooks/use-theme-transition';

export function UserMenu() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const { stxBalance } = useWallet();
  const { resolvedTheme, setThemeWithTransition } = useThemeTransition();
  const router = useRouter();

  if (!user) return null;

  const items = [
    {
      label: 'View profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => router.push(`/profile/${user.username}`),
    },
    {
      label: stxBalance ? `${formatSTX(stxBalance)} STX` : 'Wallet',
      icon: <Wallet className="w-4 h-4" />,
      onClick: () => router.push('/wallet'),
    },
    { label: '', separator: true },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      label: resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode',
      icon: resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) =>
        setThemeWithTransition(resolvedTheme === 'dark' ? 'light' : 'dark', { x: e.clientX, y: e.clientY }),
    },
    { label: '', separator: true },
    {
      label: 'Log out',
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => logout(),
      destructive: true,
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
