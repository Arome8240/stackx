'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/lib/mock-data/users';

export function CastComposer() {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = getCurrentUser();
  const maxLength = 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      // TODO: Submit cast to blockchain
      console.log('Casting:', content);
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="border-b border-border p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-12 h-12 rounded-full"
          />

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's happening?"
              className="w-full bg-transparent resize-none outline-none text-lg placeholder:text-muted-foreground"
              rows={isExpanded ? 4 : 1}
              maxLength={maxLength}
            />

            {/* Actions */}
            {isExpanded && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                    title="Add image"
                  >
                    🖼️
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                    title="Add GIF"
                  >
                    GIF
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                    title="Add emoji"
                  >
                    😊
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm ${
                      content.length > maxLength * 0.9
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {content.length}/{maxLength}
                  </span>
                  <button
                    type="submit"
                    disabled={!content.trim() || content.length > maxLength}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Cast
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
