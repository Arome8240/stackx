import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  platformFeeBps: parseInt(process.env.PLATFORM_FEE_BPS ?? '250', 10),
  stacksNetwork: process.env.STACKS_NETWORK ?? 'testnet',
  contractAddress: process.env.CONTRACT_ADDRESS ?? '',
  contractName: process.env.CONTRACT_NAME ?? 'social-platform-v2',
  walletEncryptionKey: process.env.WALLET_ENCRYPTION_KEY ?? '',
}));
