'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Smile, Loader2 } from 'lucide-react';
import { createSocialPlatformContract } from '@/lib/contracts/social-platform';
import { StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACTS, userSession } from '@/lib/stacks-config';
import { uploadImage } from '@/lib/ipfs/client';

const contract = createSocialPlatformContract({
  network: new StacksTestnet(),
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACTS.SOCIAL_PLATFORM,
});

export function CastComposer() {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxLength = 280;

  // Optimistic UI fallback
  const isConnected = userSession.isUserSignedIn();
  let avatar = '/placeholder.svg';
  let displayName = 'Guest User';
  
  if (isConnected) {
    const profile = userSession.loadUserData().profile;
    displayName = 'StackX User'; // Could be improved by fetching the on-chain profile
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isConnected || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      let imageCIDs: string[] = [];
      if (selectedImage) {
        const cid = await uploadImage(selectedImage);
        imageCIDs.push(cid);
      }

      await contract.createCast(content, imageCIDs, []);
      
      setContent('');
      setSelectedImage(null);
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to create cast:', error);
      alert('Failed to cast. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setIsExpanded(true);
    }
  };

  return (
    <div className="border-b border-border p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={avatar}
            alt={displayName}
            className="w-12 h-12 rounded-full"
          />

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={isConnected ? "What's happening?" : "Connect wallet to cast"}
              className="w-full bg-transparent resize-none outline-none text-lg placeholder:text-muted-foreground"
              rows={isExpanded ? 4 : 1}
              maxLength={maxLength}
              disabled={!isConnected || isSubmitting}
            />
            
            {/* Image Preview */}
            {selectedImage && (
              <div className="mt-2 relative inline-block">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Preview" 
                  className="max-h-48 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Actions */}
            {isExpanded && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isConnected || isSubmitting}
                    className="p-2 hover:bg-accent rounded-full transition-colors text-primary disabled:opacity-50"
                    title="Add image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    disabled={!isConnected || isSubmitting}
                    className="p-2 hover:bg-accent rounded-full transition-colors text-primary disabled:opacity-50"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5" />
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
                    disabled={!isConnected || !content.trim() || content.length > maxLength || isSubmitting}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
