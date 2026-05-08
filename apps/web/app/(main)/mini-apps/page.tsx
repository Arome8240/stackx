'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockMiniApps } from '@/lib/mock-data/messages';

export default function MiniAppsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: '📱' },
    { id: 'defi', name: 'DeFi', icon: '💰' },
    { id: 'nft', name: 'NFT', icon: '🖼️' },
    { id: 'games', name: 'Games', icon: '🎮' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'tools', name: 'Tools', icon: '🛠️' },
  ];

  const filteredApps = mockMiniApps.filter((app) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mini Apps</h1>
        <p className="text-muted-foreground">
          Discover and use apps directly within StackX
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search mini apps..."
          className="w-full bg-input border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Featured Apps */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.slice(0, 2).map((app) => (
            <Link
              key={app.id}
              href={app.url}
              className="bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl p-6 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-3xl">
                  {app.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{app.name}</h3>
                    {app.verified && (
                      <span className="text-primary text-sm">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {app.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
                    {app.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Apps */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory === 'all' ? 'All Apps' : `${categories.find(c => c.id === selectedCategory)?.name} Apps`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <Link
              key={app.id}
              href={app.url}
              className="bg-card border border-border rounded-xl p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{app.name}</h3>
                    {app.verified && (
                      <span className="text-primary text-sm">✓</span>
                    )}
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-accent text-xs rounded-full capitalize">
                    {app.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {app.description}
              </p>
            </Link>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No apps found</p>
          </div>
        )}
      </div>

      {/* Developer Section */}
      <div className="mt-12 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">Build Your Own Mini App</h2>
        <p className="text-muted-foreground mb-4">
          Create and publish mini apps for the StackX community
        </p>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          Developer Docs
        </button>
      </div>
    </div>
  );
}
