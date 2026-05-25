'use client';

import * as React from 'react';
import { Link2, Twitter, Copy, Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/lib/hooks/use-clipboard';
import { APP_URL } from '@/lib/constants';

interface ShareModalProps {
  castId: string;
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ castId, open, onClose }: ShareModalProps) {
  const castUrl = `${APP_URL}/cast/${castId}`;
  const { copied, copy } = useClipboard();

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(castUrl)}&text=${encodeURIComponent('Check out this cast on StackX!')}`;

  return (
    <Modal open={open} onClose={onClose} title="Share Cast" size="sm">
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-border/40">
          <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-muted-foreground truncate">{castUrl}</span>
          <button
            onClick={() => copy(castUrl)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </div>

        <Button
          as="a"
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <Twitter className="w-4 h-4" />
          Share on X (Twitter)
        </Button>

        <Button
          onClick={() => { copy(castUrl); onClose(); }}
          variant="primary"
          className="w-full"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </Button>
      </div>
    </Modal>
  );
}
