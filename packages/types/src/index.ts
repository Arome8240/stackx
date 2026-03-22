// Shared domain types for HealthChain dApp

export type Role = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  stacksAddress?: string;
}

export interface Patient {
  principal: string;
  bloodType: string;
  ipfsCid: string;
  registeredAt: number; // block height
  updatedAt: number;
}

export interface MedicalRecord {
  recordId: number;
  patient: string;
  doctor: string;
  ipfsCid: string;
  recordType: 'diagnosis' | 'prescription' | 'lab' | 'imaging';
  createdAt: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  apptId: number;
  patient: string;
  doctor: string;
  slot: number; // unix timestamp
  notesCid: string;
  status: AppointmentStatus;
  createdAt: number;
  updatedAt: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
