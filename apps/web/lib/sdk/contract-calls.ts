import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import type { StaxialConfig } from '../types/sdk';
import { userSession } from '../stacks-config';

export interface ContractCallOptions {
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}

/**
 * Verify/approve a hospital
 */
export async function verifyHospital(
  config: StaxialConfig,
  hospitalId: number,
  options?: ContractCallOptions
) {
  try {
    await openContractCall({
      network: config.network,
      contractAddress: config.contractAddress,
      contractName: 'hospital-registry',
      functionName: 'verify-hospital',
      functionArgs: [uintCV(hospitalId)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Hospital verified:', data.txId);
        options?.onFinish?.(data);
      },
      onCancel: () => {
        console.log('Transaction cancelled');
        options?.onCancel?.();
      },
    });
  } catch (error) {
    console.error('Error verifying hospital:', error);
    throw error;
  }
}

/**
 * Update hospital status (suspend/reactivate)
 */
export async function updateHospitalStatus(
  config: StaxialConfig,
  hospitalId: number,
  status: 'active' | 'suspended' | 'revoked',
  options?: ContractCallOptions
) {
  try {
    await openContractCall({
      network: config.network,
      contractAddress: config.contractAddress,
      contractName: 'hospital-registry',
      functionName: 'update-hospital-status',
      functionArgs: [uintCV(hospitalId), uintCV(getStatusCode(status))],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Hospital status updated:', data.txId);
        options?.onFinish?.(data);
      },
      onCancel: () => {
        console.log('Transaction cancelled');
        options?.onCancel?.();
      },
    });
  } catch (error) {
    console.error('Error updating hospital status:', error);
    throw error;
  }
}

/**
 * Revoke hospital registration
 */
export async function revokeHospital(
  config: StaxialConfig,
  hospitalId: number,
  options?: ContractCallOptions
) {
  try {
    await openContractCall({
      network: config.network,
      contractAddress: config.contractAddress,
      contractName: 'hospital-registry',
      functionName: 'revoke-hospital',
      functionArgs: [uintCV(hospitalId)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Hospital revoked:', data.txId);
        options?.onFinish?.(data);
      },
      onCancel: () => {
        console.log('Transaction cancelled');
        options?.onCancel?.();
      },
    });
  } catch (error) {
    console.error('Error revoking hospital:', error);
    throw error;
  }
}

/**
 * Helper function to convert status string to status code
 */
function getStatusCode(status: string): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'active':
      return 1;
    case 'suspended':
      return 2;
    case 'revoked':
      return 3;
    default:
      return 0;
  }
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(): boolean {
  return userSession.isUserSignedIn();
}

/**
 * Get current user address
 */
export function getCurrentUserAddress(): string | null {
  if (!userSession.isUserSignedIn()) {
    return null;
  }
  const userData = userSession.loadUserData();
  return userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
}
