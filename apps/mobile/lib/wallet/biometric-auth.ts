import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

/**
 * Biometric Authentication Utility
 * Provides Face ID, Touch ID, and fingerprint authentication
 */

export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

/**
 * Check if biometric hardware is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    return compatible;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
}

/**
 * Check if biometric is enrolled
 */
export async function isBiometricEnrolled(): Promise<boolean> {
  try {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return enrolled;
  } catch (error) {
    console.error('Error checking biometric enrollment:', error);
    return false;
  }
}

/**
 * Get available biometric types
 */
export async function getSupportedBiometricTypes(): Promise<BiometricType[]> {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const biometricTypes: BiometricType[] = [];

    types.forEach((type) => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          biometricTypes.push('fingerprint');
          break;
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          biometricTypes.push('facial');
          break;
        case LocalAuthentication.AuthenticationType.IRIS:
          biometricTypes.push('iris');
          break;
      }
    });

    return biometricTypes.length > 0 ? biometricTypes : ['none'];
  } catch (error) {
    console.error('Error getting biometric types:', error);
    return ['none'];
  }
}

/**
 * Get biometric type name for display
 */
export function getBiometricTypeName(types: BiometricType[]): string {
  if (types.includes('facial')) {
    return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
  }
  if (types.includes('fingerprint')) {
    return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
  }
  if (types.includes('iris')) {
    return 'Iris Recognition';
  }
  return 'Biometric';
}

/**
 * Authenticate with biometrics
 */
export async function authenticateWithBiometric(
  promptMessage?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if biometric is available
    const available = await isBiometricAvailable();
    if (!available) {
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    // Check if biometric is enrolled
    const enrolled = await isBiometricEnrolled();
    if (!enrolled) {
      return {
        success: false,
        error: 'No biometric credentials enrolled. Please set up biometric authentication in your device settings.',
      };
    }

    // Get biometric types for prompt
    const types = await getSupportedBiometricTypes();
    const typeName = getBiometricTypeName(types);

    // Authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage || `Authenticate with ${typeName}`,
      fallbackLabel: 'Use passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.error || 'Authentication failed',
      };
    }
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

/**
 * Authenticate for wallet access
 */
export async function authenticateForWallet(): Promise<boolean> {
  const result = await authenticateWithBiometric('Authenticate to access your wallet');
  return result.success;
}

/**
 * Authenticate for transaction
 */
export async function authenticateForTransaction(amount?: string): Promise<boolean> {
  const message = amount
    ? `Authenticate to confirm transaction of ${amount}`
    : 'Authenticate to confirm transaction';
  
  const result = await authenticateWithBiometric(message);
  return result.success;
}

/**
 * Check biometric capability and enrollment status
 */
export async function getBiometricStatus(): Promise<{
  available: boolean;
  enrolled: boolean;
  types: BiometricType[];
  typeName: string;
}> {
  const available = await isBiometricAvailable();
  const enrolled = await isBiometricEnrolled();
  const types = await getSupportedBiometricTypes();
  const typeName = getBiometricTypeName(types);

  return {
    available,
    enrolled,
    types,
    typeName,
  };
}
