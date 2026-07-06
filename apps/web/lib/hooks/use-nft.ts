'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import type { NFTListing } from '@/lib/types/social';

export function useNFTListings() {
  return useQuery<NFTListing[]>({
    queryKey: ['nft-listings'],
    queryFn: async () => [],
    staleTime: 30_000,
  });
}

export function useUserNFTs(address: string) {
  return useQuery<NFTListing[]>({
    queryKey: ['user-nfts', address],
    queryFn: async () => [],
    enabled: !!address,
    staleTime: 60_000,
  });
}

export function useMintNFT() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ castId: _castId, uri: _uri, maxEdition: _maxEdition }: { castId: number; uri: string; maxEdition: number }) => {
      // wire: contract.mintCastNFT(castId, uri, maxEdition)
      await new Promise(r => setTimeout(r, 1500));
      return { nftId: Math.floor(Math.random() * 1000) };
    },
    onSuccess: ({ nftId }) => {
      qc.invalidateQueries({ queryKey: ['nft-listings'] });
      toast({ type: 'success', title: `NFT #${nftId} minted!`, description: 'Your cast is now a collectible.' });
    },
    onError: () => toast({ type: 'error', title: 'Mint failed' }),
  });
}

export function useBuyNFT() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ nftId: _nftId, priceStx: _priceStx, sender: _sender }: { nftId: number; priceStx: number; sender: string }) => {
      // wire: contract.buyNFT(nftId, priceStx * 1_000_000, sender)
      await new Promise(r => setTimeout(r, 1200));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nft-listings', 'user-nfts'] });
      toast({ type: 'success', title: 'NFT purchased!', description: 'Transfer confirmed on Stacks.' });
    },
    onError: () => toast({ type: 'error', title: 'Purchase failed', description: 'Check your wallet balance.' }),
  });
}

export function useListNFT() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ nftId: _nftId, priceStx: _priceStx }: { nftId: number; priceStx: number }) => {
      await new Promise(r => setTimeout(r, 800));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nft-listings'] });
      toast({ type: 'success', title: 'NFT listed for sale!' });
    },
    onError: () => toast({ type: 'error', title: 'Listing failed' }),
  });
}
