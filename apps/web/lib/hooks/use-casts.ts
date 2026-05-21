import { useState, useEffect } from 'react';
import { createSocialPlatformContract } from '../contracts/social-platform';
import { StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACTS } from '../stacks-config';

// Ensure we have valid fallback values for contract instantiation
const testnet = new StacksTestnet();

// Use a safe sender address for read-only calls (just needs to be a valid Stacks address)
const READ_ONLY_SENDER = 'ST2JHG361ZXG51QTKY2ZA4XBPDAZJCWA8M634FVDQ';

export function useCasts() {
  const [casts, setCasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCasts() {
      try {
        if (!CONTRACT_ADDRESS || !CONTRACTS.SOCIAL_PLATFORM) {
          throw new Error("Contract configuration is missing.");
        }

        const contract = createSocialPlatformContract({
          network: testnet,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACTS.SOCIAL_PLATFORM,
        });

        const statsRes: any = await contract.getPlatformStats(READ_ONLY_SENDER);
        
        let totalCasts = 0;
        
        // Handle clarity value JSON structure
        if (statsRes.type?.includes('ResponseOk') || statsRes.type?.includes('response')) {
          totalCasts = parseInt(statsRes.value?.value?.['total-casts']?.value || '0', 10);
        } else if (statsRes.value?.['total-casts']) {
          totalCasts = parseInt(statsRes.value['total-casts'].value, 10);
        }
        
        // Fetch the latest 20 casts
        const startId = Math.max(1, totalCasts - 19);
        const fetchedCasts = [];

        for (let i = totalCasts; i >= startId; i--) {
          const castRes: any = await contract.getCast(i, READ_ONLY_SENDER);
          
          if (castRes.type?.includes('OptionalSome') || castRes.type?.includes('some')) {
            const castData = castRes.value?.value || castRes.value;
            
            // Format to match CastCard expected props
            fetchedCasts.push({
              id: i.toString(),
              author: {
                username: castData.author?.value || 'unknown',
                displayName: 'On-Chain User',
                avatar: '/placeholder.svg' // We could fetch get-user here too, but optimizing for now
              },
              content: castData.content?.value || '',
              timestamp: new Date().toISOString(), // Block height would need to be converted to actual time
              likes: parseInt(castData['likes-count']?.value || '0', 10),
              recasts: parseInt(castData['recasts-count']?.value || '0', 10),
              replies: parseInt(castData['replies-count']?.value || '0', 10),
              hasLiked: false,
              hasRecasted: false
            });
          }
        }
        
        setCasts(fetchedCasts);
      } catch (err: any) {
        console.error('Failed to fetch casts:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCasts();
  }, []);

  return { casts, loading, error };
}
