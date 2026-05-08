'use client';

import Link from 'next/link';
import { mockChannels } from '@/lib/mock-data/channels';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function ChannelsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = mockChannels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold mb-4">Channels</h1>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels..."
            className="w-full bg-input border border-border rounded-full px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="p-4 grid grid-cols-1 gap-4">
        {filteredChannels.map((channel) => (
          <Link
            key={channel.id}
            href={`/channels/${channel.name}`}
            className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {channel.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1">/{channel.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{channel.membersCount.toLocaleString()} members</span>
                  <span>·</span>
                  <span>{channel.castsCount.toLocaleString()} casts</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Join channel
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </div>
          </Link>
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No channels found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
