import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import type { StaxialConfig, Hospital } from '../types/sdk';

export async function getHospital(
  config: StaxialConfig,
  hospitalId: number
): Promise<Hospital | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: config.contractAddress,
      contractName: 'hospital-registry',
      functionName: 'get-hospital',
      functionArgs: [uintCV(hospitalId)],
      network: config.network,
      senderAddress: config.contractAddress,
    });

    const json = cvToJSON(result);
    if (json.type === 'none' || !json.value) {
      return null;
    }

    const value = json.value as Record<string, unknown>;
    return {
      id: hospitalId,
      owner: value.owner as string,
      name: value.name as string,
      licenseNumber: value['license-number'] as string,
      location: value.location as string,
      verified: value.verified as boolean,
      status: value.status as Hospital['status'],
      stake: BigInt(value.stake as string | number),
      rating: value.rating as number,
      totalRatings: value['total-ratings'] as number,
      registeredAt: value['registered-at'] as number,
    };
  } catch (error) {
    console.error('Error fetching hospital:', error);
    return null;
  }
}

export async function getHospitalByPrincipal(
  config: StaxialConfig,
  owner: string
): Promise<Hospital | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: config.contractAddress,
      contractName: 'hospital-registry',
      functionName: 'get-hospital-by-principal',
      functionArgs: [principalCV(owner)],
      network: config.network,
      senderAddress: config.contractAddress,
    });

    const json = cvToJSON(result);
    if (json.type === 'none' || !json.value) {
      return null;
    }

    const value = json.value as Record<string, unknown>;
    return {
      id: value.id as number,
      owner: value.owner as string,
      name: value.name as string,
      licenseNumber: value['license-number'] as string,
      location: value.location as string,
      verified: value.verified as boolean,
      status: value.status as Hospital['status'],
      stake: BigInt(value.stake as string | number),
      rating: value.rating as number,
      totalRatings: value['total-ratings'] as number,
      registeredAt: value['registered-at'] as number,
    };
  } catch (error) {
    console.error('Error fetching hospital by principal:', error);
    return null;
  }
}

export async function isHospitalVerified(
  config: StaxialConfig,
  hospitalId: number
): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: config.contractAddress,
      contractName: 'hospital-registry',
      functionName: 'is-hospital-verified',
      functionArgs: [uintCV(hospitalId)],
      network: config.network,
      senderAddress: config.contractAddress,
    });

    const json = cvToJSON(result);
    return (json.value as boolean) || false;
  } catch (error) {
    console.error('Error checking hospital verification:', error);
    return false;
  }
}
