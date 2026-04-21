// Prescription-related types

export enum PrescriptionStatus {
  ACTIVE = "active",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
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
  status: PrescriptionStatus;
  fulfilledBy?: string;
  fulfilledAt?: number;
}

export interface Medication {
  prescriptionId: number;
  index: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface Pharmacy {
  id: number;
  owner: string;
  name: string;
  licenseNumber: string;
  location: string;
  verified: boolean;
  active: boolean;
  registeredAt: number;
}

export interface PharmacyRegistration {
  name: string;
  licenseNumber: string;
  location: string;
}

export interface PrescriptionFulfillment {
  prescriptionId: number;
  pharmacyId: number;
  fulfilledAt: number;
  medications: MedicationFulfillment[];
}

export interface MedicationFulfillment {
  medicationIndex: number;
  quantityDispensed: number;
  batchNumber?: string;
  expiryDate?: string;
}
