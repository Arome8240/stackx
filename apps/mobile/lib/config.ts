/**
 * Mobile App Configuration
 * Reads from environment variables set in .env file
 */

export const config = {
  // Stacks Network
  stacksNetwork: (process.env.EXPO_PUBLIC_STACKS_NETWORK as 'mainnet' | 'testnet') || 'testnet',
  contractAddress: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS || '',
  contractDeployer: process.env.EXPO_PUBLIC_CONTRACT_DEPLOYER || '',

  // API
  apiUrl: process.env.EXPO_PUBLIC_API_URL || '',

  // Feature Flags
  enableBiometricAuth: process.env.EXPO_PUBLIC_ENABLE_BIOMETRIC_AUTH === 'true',
  enablePushNotifications: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',

  // App Info
  appName: 'Staxial Health',
  appVersion: '0.1.0',
} as const;

// Validate required configuration
export function validateConfig() {
  const errors: string[] = [];

  if (!config.contractAddress) {
    errors.push('EXPO_PUBLIC_CONTRACT_ADDRESS is not set');
  }

  if (!config.contractDeployer) {
    errors.push('EXPO_PUBLIC_CONTRACT_DEPLOYER is not set');
  }

  if (errors.length > 0) {
    console.warn('Configuration warnings:', errors);
  }

  return errors.length === 0;
}

// Network configuration
export const getNetworkConfig = () => {
  return {
    network: config.stacksNetwork,
    contractAddress: config.contractAddress,
    contractDeployer: config.contractDeployer,
  };
};
