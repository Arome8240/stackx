import type { StacksNetwork } from '@stacks/network';

export interface StaxialConfig {
  network: StacksNetwork;
  contractAddress: string;
  contractName: string;
  stacksApiUrl: string;
}

export interface Hospital {
  id: number;
  owner: string;
  name: string;
  licenseNumber: string;
  location: string;
  verified: boolean;
  status: 'pending' | 'active' | 'suspended' | 'revoked';
  stake: bigint;
  rating: number;
  totalRatings: number;
  registeredAt: number;
}

export interface Patient {
  registered: boolean;
  registeredAt: number;
}

export interface Appointment {
  id: number;
  patient: string;
  hospital: string;
  doctor: string;
  scheduledTime: number;
  duration: number;
  fee: bigint;
  platformFee: bigint;
  status: string;
  notes?: string;
  createdAt: number;
}

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
