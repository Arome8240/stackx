// Patient-related types

export interface Patient {
  address: string;
  name: string;
  dateOfBirth: string;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: EmergencyContact;
  registeredAt: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalRecord {
  id: number;
  patient: string;
  hospital: string;
  recordType: RecordType;
  ipfsHash: string;
  encryptionKey?: string;
  timestamp: number;
  description: string;
}

export enum RecordType {
  CONSULTATION = "consultation",
  LAB_RESULT = "lab_result",
  IMAGING = "imaging",
  PRESCRIPTION = "prescription",
  VACCINATION = "vaccination",
  SURGERY = "surgery",
  DIAGNOSIS = "diagnosis",
  OTHER = "other",
}

export interface Consent {
  patient: string;
  hospital: string;
  granted: boolean;
  grantedAt?: number;
  revokedAt?: number;
  expiresAt?: number;
}

export interface AccessLog {
  recordId: number;
  accessedBy: string;
  accessedAt: number;
  purpose: string;
}

export interface EmergencyAccess {
  requestId: number;
  patient: string;
  hospital: string;
  reason: string;
  requestedAt: number;
  approved: boolean;
  approvedAt?: number;
}
