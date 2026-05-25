export const APP_NAME = 'StackX';
export const APP_DESCRIPTION = 'Decentralized social platform built on the Stacks blockchain';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://stackx.app';

export const PLATFORM_FEE_BPS = 250; // 2.5%
export const CREATOR_ROYALTY_BPS = 500; // 5%

export const MAX_CAST_LENGTH = 320;
export const MAX_IMAGES_PER_CAST = 4;
export const MAX_POLL_OPTIONS = 4;
export const MIN_POLL_OPTIONS = 2;

export const STACKS_NETWORKS = {
  mainnet: 'mainnet',
  testnet: 'testnet',
  devnet: 'devnet',
} as const;

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_AVATAR_SIZE_MB = 5;

export const FEED_PAGE_SIZE = 20;
export const SEARCH_DEBOUNCE_MS = 300;
export const NOTIFICATION_POLL_INTERVAL_MS = 30_000;

export const TIER_LABELS = {
  0: 'Basic',
  1: 'Verified',
  2: 'Pro',
} as const;

export const CHANNEL_NAME_REGEX = /^[a-z0-9-]{3,32}$/;

export const STX_DECIMALS = 6;
export const MICRO_STX_PER_STX = 1_000_000;
