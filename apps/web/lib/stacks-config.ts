import { AppConfig, UserSession } from '@stacks/connect';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const APP_NAME = 'StackX';
export const APP_ICON = '/logo.png';

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// Contract names
export const CONTRACTS = {
  SOCIAL_PLATFORM: process.env.NEXT_PUBLIC_CONTRACT_NAME || 'social-platform',
} as const;
