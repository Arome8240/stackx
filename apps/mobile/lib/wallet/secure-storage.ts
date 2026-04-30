import * as SecureStore from 'expo-secure-store';

/**
 * Secure Storage Utility
 * Provides encrypted storage for sensitive wallet data
 */

// Storage Keys
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'wallet_address',
  WALLET_SESSION: 'wallet_session',
  WALLET_PUBLIC_KEY: 'wallet_public_key',
  USER_PREFERENCES: 'user_preferences',
  BIOMETRIC_ENABLED: 'biometric_enabled',
} as const;

/**
 * Save data securely
 */
export async function saveSecure(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw new Error(`Failed to save ${key} securely`);
  }
}

/**
 * Get data securely
 */
export async function getSecure(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
}

/**
 * Delete data securely
 */
export async function deleteSecure(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
    throw new Error(`Failed to delete ${key}`);
  }
}

/**
 * Clear all secure storage
 */
export async function clearAllSecure(): Promise<void> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map((key) => deleteSecure(key)));
  } catch (error) {
    console.error('Error clearing secure storage:', error);
    throw new Error('Failed to clear secure storage');
  }
}

/**
 * Save wallet session
 */
export async function saveWalletSession(address: string, sessionData: any): Promise<void> {
  await saveSecure(STORAGE_KEYS.WALLET_ADDRESS, address);
  await saveSecure(STORAGE_KEYS.WALLET_SESSION, JSON.stringify(sessionData));
}

/**
 * Get wallet session
 */
export async function getWalletSession(): Promise<{
  address: string | null;
  session: any | null;
}> {
  const address = await getSecure(STORAGE_KEYS.WALLET_ADDRESS);
  const sessionStr = await getSecure(STORAGE_KEYS.WALLET_SESSION);
  const session = sessionStr ? JSON.parse(sessionStr) : null;

  return { address, session };
}

/**
 * Clear wallet session
 */
export async function clearWalletSession(): Promise<void> {
  await deleteSecure(STORAGE_KEYS.WALLET_ADDRESS);
  await deleteSecure(STORAGE_KEYS.WALLET_SESSION);
  await deleteSecure(STORAGE_KEYS.WALLET_PUBLIC_KEY);
}

/**
 * Save user preferences
 */
export async function saveUserPreferences(preferences: Record<string, any>): Promise<void> {
  await saveSecure(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
}

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<Record<string, any> | null> {
  const prefsStr = await getSecure(STORAGE_KEYS.USER_PREFERENCES);
  return prefsStr ? JSON.parse(prefsStr) : null;
}

/**
 * Check if biometric is enabled
 */
export async function isBiometricEnabled(): Promise<boolean> {
  const enabled = await getSecure(STORAGE_KEYS.BIOMETRIC_ENABLED);
  return enabled === 'true';
}

/**
 * Set biometric enabled status
 */
export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await saveSecure(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
}

/**
 * Validate storage availability
 */
export async function isSecureStoreAvailable(): Promise<boolean> {
  try {
    await SecureStore.setItemAsync('test_key', 'test_value');
    await SecureStore.deleteItemAsync('test_key');
    return true;
  } catch (error) {
    console.error('Secure store not available:', error);
    return false;
  }
}
