export const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// Contract names
export const CONTRACTS = {
  SOCIAL_PLATFORM: process.env.NEXT_PUBLIC_CONTRACT_NAME || 'social-platform',
} as const;
