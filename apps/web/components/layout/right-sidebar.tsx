'use client';

import Link from 'next/link';
import { Search, TrendingUp, Users } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const TRENDING = [
  { tag: '#StacksBTC', posts: 2840 },
  { tag: '#ClarityLang', posts: 1205 },
  { tag: '#DeSo', posts: 980 },
  { tag: '#Web3Social', posts: 754 },
  { tag: '#NFTDrop', posts: 612 },
];

const SUGGESTED = [
  { username: 'muneeb', displayName: 'Muneeb Ali', avatar: '', verified: true, bio: 'Co-founder @Stacks' },
  { username: 'satoshi_hiro', displayName: 'Hiro Systems', avatar: '', verified: true, bio: 'Building on Stacks' },
  { username: 'punk6529', displayName: 'punk6529', avatar: '', verified: false, bio: 'NFT collector & builder' },
  { username: 'clarity_dev', displayName: 'Clarity Dev', avatar: '', verified: false, bio: 'Smart contract engineer' },
];

export function RightSidebar() {
  return (
    <aside className="fixed right-0 top-0 h-screen w-80 hidden xl:flex flex-col gap-5 p-4 overflow-y-auto z-30 scrollbar-none">
      {/* Search box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          placeholder="Search StackX"
          className="w-full rounded-xl border border-border bg-muted pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
        />
      </div>

      {/* Trending */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Trending</h2>
        </div>
        <div className="divide-y divide-border">
          {TRENDING.map(({ tag, posts }, i) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/40 transition-colors group"
            >
              <div>
                <span className="text-xs text-muted-foreground">{i + 1} · Trending</span>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{tag}</p>
                <span className="text-xs text-muted-foreground">{posts.toLocaleString()} casts</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="px-4 py-3">
          <Link href="/explore" className="text-xs text-primary hover:underline">Show more</Link>
        </div>
      </div>

      {/* Who to follow */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Who to follow</h2>
        </div>
        <div className="divide-y divide-border">
          {SUGGESTED.map(user => (
            <Link
              key={user.username}
              href={`/profile/${user.username}`}
              className="flex items-start gap-3 px-4 py-3 hover:bg-accent/40 transition-colors"
            >
              <Avatar src={user.avatar} alt={user.displayName} size="sm" verified={user.verified} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold truncate">{user.displayName}</span>
                  {user.verified && <Badge variant="primary" className="text-[10px] px-1.5 py-0">Pro</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">@{user.username}</span>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</p>
              </div>
              <Button size="xs" variant="outline" className="shrink-0 ml-2">
                Follow
              </Button>
            </Link>
          ))}
        </div>
        <div className="px-4 py-3">
          <Link href="/explore" className="text-xs text-primary hover:underline">Show more</Link>
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1">
        {['Privacy', 'Terms', 'About', 'Help'].map(l => (
          <Link key={l} href={`/${l.toLowerCase()}`} className="text-xs text-muted-foreground hover:underline">
            {l}
          </Link>
        ))}
        <span className="text-xs text-muted-foreground">© 2025 StackX</span>
      </div>
    </aside>
  );
}
