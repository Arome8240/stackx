'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import type { User } from '@/lib/types/social';

export function useProfile(username: string) {
  return useQuery<User | null>({
    queryKey: ['profile', username],
    queryFn: async () => null, // wire to contract.getUser() then format
    staleTime: 60_000,
    enabled: !!username,
  });
}

export function useFollowUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ address, following }: { address: string; following: boolean }) => {
      // wire: following ? contract.unfollowUser(address) : contract.followUser(address)
      await new Promise(r => setTimeout(r, 800));
    },
    onSuccess: (_, { following }) => {
      toast({ type: 'success', title: following ? 'Unfollowed' : 'Following!' });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast({ type: 'error', title: 'Action failed' }),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (args: {
      displayName: string;
      bio: string;
      avatarIpfs: string;
      bannerIpfs?: string;
      website?: string;
      location?: string;
    }) => {
      // wire: contract.updateProfile(...)
      await new Promise(r => setTimeout(r, 1000));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast({ type: 'success', title: 'Profile updated!' });
    },
    onError: () => toast({ type: 'error', title: 'Update failed' }),
  });
}
