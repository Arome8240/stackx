'use client';

import * as React from 'react';
import {
  Image as ImageIcon, Smile, BarChart3, Hash,
  X, Loader2, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

const MAX_LENGTH = 560;

interface PollDraft {
  question: string;
  options: string[];
}

interface CastComposerProps {
  placeholder?: string;
  parentCastId?: string;
  channelId?: string;
  compact?: boolean;
  onSuccess?: (castId: string) => void;
  autoFocus?: boolean;
}

export function CastComposer({
  placeholder = "What's happening on-chain?",
  parentCastId,
  channelId,
  compact,
  onSuccess,
  autoFocus,
}: CastComposerProps) {
  const { toast } = useToast();
  const [text, setText] = React.useState('');
  const [images, setImages] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState(!compact);
  const [submitting, setSubmitting] = React.useState(false);
  const [showPoll, setShowPoll] = React.useState(false);
  const [poll, setPoll] = React.useState<PollDraft>({ question: '', options: ['', ''] });
  const fileRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_LENGTH - text.length;
  const isNearLimit = remaining < MAX_LENGTH * 0.15;
  const isOverLimit  = remaining < 0;
  const canSubmit    = text.trim().length > 0 && !isOverLimit && !submitting;

  React.useEffect(() => {
    if (autoFocus) textRef.current?.focus();
  }, [autoFocus]);

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - images.length);
    setImages(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setImagePreviews(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, j) => j !== i));
    setImagePreviews(prev => prev.filter((_, j) => j !== i));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      // Contract call happens here — wire up in production
      await new Promise(r => setTimeout(r, 800)); // Simulated tx
      toast({ type: 'success', title: 'Cast published!', description: 'Your cast is being confirmed on Stacks.' });
      setText('');
      setImages([]);
      setImagePreviews([]);
      setShowPoll(false);
      setPoll({ question: '', options: ['', ''] });
      setExpanded(compact ? false : true);
      onSuccess?.('mock-cast-id');
    } catch {
      toast({ type: 'error', title: 'Failed to cast', description: 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const circumference = 2 * Math.PI * 16;
  const progressOffset = circumference * (1 - Math.min(1, text.length / MAX_LENGTH));

  return (
    <div className={cn('border-b border-border bg-background', compact ? 'p-3' : 'p-4')}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar src={null} alt="You" size={compact ? 'sm' : 'md'} className="shrink-0 mt-0.5" />

        {/* Input area */}
        <div className="flex-1 min-w-0">
          {/* Channel badge */}
          {channelId && (
            <div className="mb-2">
              <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                /{channelId}
              </span>
            </div>
          )}

          <textarea
            ref={textRef}
            value={text}
            onChange={handleTextChange}
            onFocus={() => setExpanded(true)}
            placeholder={placeholder}
            rows={compact ? 1 : 2}
            className={cn(
              'w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground',
              compact ? 'text-sm' : 'text-base',
              'min-h-[2.5rem] leading-relaxed',
            )}
            style={{ height: 'auto' }}
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className={cn('mt-3 gap-2', imagePreviews.length > 1 ? 'grid grid-cols-2' : 'flex')}>
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-video">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Poll builder */}
          {showPoll && (
            <div className="mt-3 rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <input
                value={poll.question}
                onChange={e => setPoll(p => ({ ...p, question: e.target.value }))}
                placeholder="Ask a question…"
                className="w-full bg-transparent border-b border-border pb-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {poll.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                  <input
                    value={opt}
                    onChange={e => {
                      const opts = [...poll.options];
                      opts[i] = e.target.value;
                      setPoll(p => ({ ...p, options: opts }));
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                  />
                  {poll.options.length > 2 && (
                    <button onClick={() => setPoll(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </div>
              ))}
              {poll.options.length < 4 && (
                <button
                  onClick={() => setPoll(p => ({ ...p, options: [...p.options, ''] }))}
                  className="text-xs text-primary hover:underline"
                >
                  + Add option
                </button>
              )}
            </div>
          )}

          {/* Toolbar */}
          {expanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-0.5">
                {/* Image upload */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <ToolButton
                  icon={<ImageIcon className="w-4 h-4" />}
                  label="Add image"
                  disabled={images.length >= 4 || showPoll}
                  onClick={() => fileRef.current?.click()}
                />
                <ToolButton icon={<Smile className="w-4 h-4" />} label="Add emoji" />
                <ToolButton icon={<Hash className="w-4 h-4" />} label="Add hashtag" />
                <ToolButton
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Add poll"
                  active={showPoll}
                  disabled={images.length > 0}
                  onClick={() => setShowPoll(v => !v)}
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Character ring */}
                {text.length > 0 && (
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" strokeWidth="3" className="stroke-muted" />
                    <circle
                      cx="20" cy="20" r="16" fill="none" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      className={cn(
                        'transition-all duration-150',
                        isOverLimit  ? 'stroke-destructive' :
                        isNearLimit  ? 'stroke-yellow-500'  :
                                       'stroke-primary',
                      )}
                    />
                    {remaining <= 20 && (
                      <text
                        x="20" y="20"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-foreground"
                        style={{ fontSize: 11, transform: 'rotate(90deg)', transformOrigin: '20px 20px' }}
                      >
                        {remaining}
                      </text>
                    )}
                  </svg>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  loading={submitting}
                  size="sm"
                  icon={<Zap className="w-3.5 h-3.5 fill-current" />}
                >
                  Cast
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon, label, active, disabled, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean; onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'p-2 rounded-full transition-colors text-muted-foreground',
        active ? 'text-primary bg-primary/10' : 'hover:bg-accent hover:text-foreground',
        'disabled:opacity-30 disabled:cursor-not-allowed',
      )}
    >
      {icon}
    </button>
  );
}
