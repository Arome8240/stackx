'use client';

import * as React from 'react';
import { Search, Plus, Send, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatTimeAgo, cn } from '@/lib/utils';

const CONVERSATIONS = [
  { id: '1', user: { username: 'muneeb',      displayName: 'Muneeb Ali',    avatar: '', verified: true  }, lastMessage: 'Great point about Clarity!',      time: new Date(Date.now() - 600_000).toISOString(),    unread: 2 },
  { id: '2', user: { username: 'satoshi_hiro',displayName: 'Hiro Systems',  avatar: '', verified: true  }, lastMessage: 'Check out our new devnet release.', time: new Date(Date.now() - 3_600_000).toISOString(),  unread: 0 },
  { id: '3', user: { username: 'alice',        displayName: 'Alice',         avatar: '', verified: false }, lastMessage: 'Thanks for the tip! 🙏',           time: new Date(Date.now() - 7_200_000).toISOString(),  unread: 0 },
  { id: '4', user: { username: 'bob',          displayName: 'Bob',           avatar: '', verified: false }, lastMessage: 'When are you posting next?',       time: new Date(Date.now() - 86_400_000).toISOString(), unread: 0 },
];

const MESSAGES_BY_CONV: Record<string, Array<{ id: string; text: string; from: 'me' | 'them'; time: string }>> = {
  '1': [
    { id: 'm1', text: 'Hey! Loved your last cast about Bitcoin L2s.',                           from: 'them', time: new Date(Date.now() - 700_000).toISOString() },
    { id: 'm2', text: 'Thanks! The ecosystem is really picking up.',                            from: 'me',   time: new Date(Date.now() - 680_000).toISOString() },
    { id: 'm3', text: 'Great point about Clarity!',                                             from: 'them', time: new Date(Date.now() - 600_000).toISOString() },
  ],
};

export default function MessagesPage() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState(MESSAGES_BY_CONV['1'] ?? []);

  const conv = CONVERSATIONS.find(c => c.id === selected);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: String(Date.now()), text: input, from: 'me', time: new Date().toISOString() }]);
    setInput('');
  };

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        {selected ? (
          <>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-full hover:bg-accent transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar src={conv?.user.avatar} alt={conv?.user.displayName ?? ''} size="sm" verified={conv?.user.verified} />
              <div>
                <p className="font-semibold text-sm leading-tight">{conv?.user.displayName}</p>
                <p className="text-xs text-muted-foreground">@{conv?.user.username}</p>
              </div>
            </div>
            <button className="p-1.5 rounded-full hover:bg-accent transition-colors text-muted-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold">Messages</h1>
            <Button size="icon" variant="ghost" aria-label="New message">
              <Plus className="w-5 h-5" />
            </Button>
          </>
        )}
      </header>

      {selected ? (
        /* Chat view */
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(MESSAGES_BY_CONV[selected] ?? messages).map(msg => (
              <div key={msg.id} className={cn('flex', msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.from === 'me'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm',
                )}>
                  <p>{msg.text}</p>
                  <p className={cn('text-[10px] mt-1', msg.from === 'me' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                    {formatTimeAgo(msg.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form onSubmit={sendMessage} className="flex items-end gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Send a message…"
                className="flex-1 rounded-2xl border border-border bg-muted px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
              />
              <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        /* Conversation list */
        <div className="flex-1">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search conversations"
                className="w-full rounded-full border border-border bg-muted pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
            </div>
          </div>

          {CONVERSATIONS.length === 0 ? (
            <EmptyState title="No messages yet" description="Start a conversation with someone you follow." />
          ) : (
            <div className="divide-y divide-border">
              {CONVERSATIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelected(c.id); setMessages(MESSAGES_BY_CONV[c.id] ?? []); }}
                  className="w-full flex items-start gap-3 px-4 py-4 hover:bg-accent/30 transition-colors text-left"
                >
                  <Avatar src={c.user.avatar} alt={c.user.displayName} size="md" verified={c.user.verified} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-sm">{c.user.displayName}</span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(c.time)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{c.lastMessage}</p>
                      {c.unread > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
