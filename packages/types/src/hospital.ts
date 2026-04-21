// Hospital-related types

export enum HospitalStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  REVOKED = "revoked",
}

export enum Specialty {
  GENERAL = "general",
  CARDIOLOGY = "cardiology",
  NEUROLOGY = "neurology",
  PEDIATRICS = "pediatrics",
  ORTHOPEDICS = "orthopedics",
  DERMATOLOGY = "dermatology",
  PSYCHIATRY = "psychiatry",
  ONCOLOGY = "oncology",
  RADIOLOGY = "radiology",
  EMERGENCY = "emergency",
}

export interface Hospital {
  id: number;
  owner: string;
  name: string;
  licenseNumber: string;
  location: string;
  specialties: Specialty[];
  verified: boolean;
  status: HospitalStatus;
  stake: bigint;
  rating: number;
  totalRatings: number;
  registeredAt: number;
}

export interface HospitalRegistration {
  name: string;
  licenseNumber: string;
  location: string;
  specialties: Specialty[];
  stakeAmount: bigint;
}

export interface HospitalRating {
  hospitalId: number;
  rating: number;
  comment?: string;
  ratedBy: string;
  ratedAt: number;
}

export interface Doctor {
  id: string;
  hospitalId: number;
  name: string;
  specialty: Specialty;
  licenseNumber: string;
  available: boolean;
}
