import { getPrescription, isPrescriptionValid } from 'staxial-sdk';

export interface Prescription {
  id: number;
  patient: string;
  hospital: string;
  doctor: string;
  issuedAt: number;
  expiresAt: number;
  diagnosis: string;
  notes?: string;
  status: string;
}

export async function fetchPrescription(
  network: any,
  contractAddress: string,
  contractName: string,
  prescriptionId: number
): Promise<Prescription | null> {
  try {
    const prescription = await getPrescription(
      { network, contractAddress, contractName },
      prescriptionId
    );
    return prescription as any;
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}

export async function checkPrescriptionValidity(
  network: any,
  contractAddress: string,
  contractName: string,
  prescriptionId: number
): Promise<boolean> {
  try {
    return await isPrescriptionValid(
      { network, contractAddress, contractName },
      prescriptionId
    );
  } catch (error) {
    console.error('Error checking prescription validity:', error);
    return false;
  }
}

export function getPrescriptionStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-900/50 text-green-400';
    case 'fulfilled':
      return 'bg-blue-900/50 text-blue-400';
    case 'expired':
      return 'bg-red-900/50 text-red-400';
    case 'cancelled':
      return 'bg-gray-700 text-gray-400';
    default:
      return 'bg-gray-700 text-gray-400';
  }
}
