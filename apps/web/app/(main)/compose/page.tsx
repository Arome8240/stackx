'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CastComposer } from '@/components/cast/cast-composer';

export default function ComposePage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">New Cast</h1>
      </div>
      <div className="p-4">
        <CastComposer
          onSuccess={() => router.back()}
          placeholder="What's on-chain today?"
          autoFocus
        />
      </div>
    </div>
  );
}
