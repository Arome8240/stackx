'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSocialPlatformContract } from '@/lib/contracts/social-platform';
import { StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACTS, userSession } from '@/lib/stacks-config';
import { uploadImage } from '@/lib/ipfs/client';
import { Loader2, Upload } from 'lucide-react';

const contract = createSocialPlatformContract({
  network: new StacksTestnet(),
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACTS.SOCIAL_PLATFORM,
});

export default function ProfileSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isConnected = userSession.isUserSignedIn();
  let userAddress = '';
  if (isConnected) {
    userAddress = userSession.loadUserData().profile.stxAddress.testnet;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!username || !displayName || !selectedImage) {
      alert("Please fill all required fields and upload an avatar.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const avatarCid = await uploadImage(selectedImage);
      await contract.registerUser(username.toLowerCase(), displayName, bio, avatarCid, userAddress);
      
      router.push('/');
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center border-x border-border min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet to Setup Profile</h1>
        <p className="text-muted-foreground">You must connect a Stacks wallet to create a profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold">Setup Profile</h1>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div 
              className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-accent/50 cursor-pointer overflow-hidden relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Upload Avatar</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                <span className="text-white text-sm font-medium">Change</span>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setSelectedImage(e.target.files[0]);
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="e.g. alice"
                className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors"
                maxLength={50}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Letters, numbers, underscores, and dashes only.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Name *</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alice Chen"
                className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors resize-none"
                rows={4}
                maxLength={500}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username || !displayName || !selectedImage}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? 'Registering Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
