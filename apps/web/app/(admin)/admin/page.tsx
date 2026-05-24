'use client';

import * as React from 'react';
import {
  Users, MessageSquare, Hash, ShoppingBag, BarChart3,
  Shield, AlertTriangle, TrendingUp, Zap, Settings,
  Flag, CheckCircle, XCircle, RefreshCw,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const PLATFORM_STATS = [
  { label: 'Total Users', value: 42_184, change: '+1.2%', icon: Users, color: 'violet' },
  { label: 'Total Casts', value: 1_284_000, change: '+3.8%', icon: MessageSquare, color: 'blue' },
  { label: 'Channels', value: 3_200, change: '+0.9%', icon: Hash, color: 'green' },
  { label: 'NFTs Minted', value: 8_900, change: '+12.4%', icon: ShoppingBag, color: 'orange' },
  { label: 'STX Treasury', value: 184_500_000, change: '+5.1%', icon: Zap, color: 'fuchsia' },
  { label: 'Reports Pending', value: 34, change: '-8', icon: Flag, color: 'red' },
];

const RECENT_REPORTS = [
  { id: 1, type: 'cast', content: 'Spam content promoting scam tokens...', reporter: 'alice', status: 'pending' },
  { id: 2, type: 'user', content: 'Account impersonating @satoshi', reporter: 'bob', status: 'reviewing' },
  { id: 3, type: 'cast', content: 'Explicit content in public channel', reporter: 'carol', status: 'resolved' },
  { id: 4, type: 'channel', content: 'Channel promoting illegal activity', reporter: 'dave', status: 'pending' },
  { id: 5, type: 'cast', content: 'Coordinated inauthentic behavior detected', reporter: 'system', status: 'reviewing' },
];

const RECENT_USERS = [
  { id: 1, username: 'web3_chad', email: 'chad@example.com', tier: 0, isVerified: false, joinedAt: '2024-01-15', castsCount: 42 },
  { id: 2, username: 'clarity_dev', email: 'dev@example.com', tier: 2, isVerified: true, joinedAt: '2024-01-14', castsCount: 218 },
  { id: 3, username: 'stacks_fan', email: 'fan@example.com', tier: 1, isVerified: false, joinedAt: '2024-01-14', castsCount: 89 },
  { id: 4, username: 'btc_maxi', email: 'maxi@example.com', tier: 0, isVerified: false, joinedAt: '2024-01-13', castsCount: 12 },
  { id: 5, username: 'nft_artist', email: 'artist@example.com', tier: 1, isVerified: true, joinedAt: '2024-01-13', castsCount: 156 },
];

type AdminTab = 'overview' | 'users' | 'content' | 'finance';

const colorMap: Record<string, string> = {
  violet: 'text-violet-400 bg-violet-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  green: 'text-green-400 bg-green-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
  fuchsia: 'text-fuchsia-400 bg-fuchsia-500/10',
  red: 'text-red-400 bg-red-500/10',
};

export default function AdminDashboard() {
  const [tab, setTab] = React.useState<AdminTab>('overview');

  const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'content', label: 'Content', icon: Shield },
    { key: 'finance', label: 'Finance', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-400" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">StackX Platform Management</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground glass px-3 py-2 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 p-1 glass rounded-xl w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === key ? 'bg-violet-500/20 text-violet-300' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {PLATFORM_STATS.map(({ label, value, change, icon: Icon, color }) => (
              <div key={label} className="glass rounded-xl p-4">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', colorMap[color])}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {label === 'STX Treasury' ? `${(value / 1_000_000).toFixed(1)}M` : formatNumber(value)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                <div className={cn('text-xs mt-1 font-medium', change.startsWith('+') ? 'text-green-400' : change.startsWith('-') && change !== '-8' ? 'text-red-400' : 'text-green-400')}>
                  {change}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent reports */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-400" />
                  Recent Reports
                </h2>
                <span className="text-xs text-muted-foreground">34 pending</span>
              </div>
              <div className="space-y-3">
                {RECENT_REPORTS.map((report) => (
                  <div key={report.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className={cn('p-1.5 rounded-lg shrink-0', report.status === 'pending' ? 'bg-red-500/10 text-red-400' : report.status === 'reviewing' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400')}>
                      {report.status === 'resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-foreground capitalize">{report.type}</span>
                        <span className="text-xs text-muted-foreground">by @{report.reporter}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{report.content}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1 rounded hover:bg-green-500/20 text-muted-foreground hover:text-green-400 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent users */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  Recent Registrations
                </h2>
                <span className="text-xs text-muted-foreground">+42 today</span>
              </div>
              <div className="space-y-3">
                {RECENT_USERS.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">@{user.username}</span>
                        {user.isVerified && <CheckCircle className="w-3 h-3 text-violet-400" />}
                        {user.tier > 0 && (
                          <span className="text-xs bg-violet-500/20 text-violet-400 px-1.5 rounded">
                            Tier {user.tier}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.castsCount} casts · {user.joinedAt}</div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-violet-500/20 text-muted-foreground hover:text-violet-400 transition-colors" title="Verify">
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors" title="Suspend">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground">
                  <th className="text-left pb-3 font-medium">Username</th>
                  <th className="text-left pb-3 font-medium">Email</th>
                  <th className="text-left pb-3 font-medium">Tier</th>
                  <th className="text-left pb-3 font-medium">Casts</th>
                  <th className="text-left pb-3 font-medium">Joined</th>
                  <th className="text-left pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((user) => (
                  <tr key={user.id} className="border-b border-border/20 hover:bg-white/[0.02]">
                    <td className="py-3 font-medium text-foreground flex items-center gap-2">
                      @{user.username}
                      {user.isVerified && <CheckCircle className="w-3.5 h-3.5 text-violet-400" />}
                    </td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs', user.tier === 2 ? 'bg-violet-500/20 text-violet-400' : user.tier === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-muted-foreground')}>
                        Tier {user.tier}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{user.castsCount}</td>
                    <td className="py-3 text-muted-foreground">{user.joinedAt}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Verify</button>
                        <button className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">Suspend</button>
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Content Moderation</h2>
          <div className="space-y-3">
            {RECENT_REPORTS.map((report) => (
              <div key={report.id} className="p-4 rounded-xl bg-white/[0.02] border border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground capitalize px-2 py-0.5 rounded-full bg-white/5">{report.type}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', report.status === 'pending' ? 'bg-red-500/20 text-red-400' : report.status === 'reviewing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400')}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.content}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">Reported by @{report.reporter}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
                      Dismiss
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'finance' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              Treasury Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Treasury</span>
                <span className="font-bold gradient-text">184.5M STX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Platform Fees (2.5%)</span>
                <span className="text-sm text-foreground">12,400 STX / day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Channel Revenue (10%)</span>
                <span className="text-sm text-foreground">8,200 STX / day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">NFT Royalties (5%)</span>
                <span className="text-sm text-foreground">3,100 STX / day</span>
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Total Daily Revenue</span>
                <span className="font-bold text-green-400">23,700 STX</span>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-violet-400" />
              Fee Settings
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Platform Fee (tips)', current: '2.5%', bps: 250 },
                { label: 'Channel Revenue Share', current: '10%', bps: 1000 },
                { label: 'NFT Royalties', current: '5%', bps: 500 },
              ].map(({ label, current, bps }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground">{bps} BPS</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-violet-400">{current}</span>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
