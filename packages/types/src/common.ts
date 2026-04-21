// Common types used across the application

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ContractCallResult {
  success: boolean;
  txId?: string;
  error?: string;
  value?: unknown;
}

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

export interface EncryptionMetadata {
  algorithm: string;
  keyId: string;
  iv?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  HOSPITAL_ADMIN = "hospital_admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
  PHARMACY = "pharmacy",
}

export interface User {
  address: string;
  role: UserRole;
  name?: string;
  email?: string;
  verified: boolean;
  createdAt: number;
}

export interface Notification {
  id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  data?: Record<string, unknown>;
}

export enum NotificationType {
  APPOINTMENT_REMINDER = "appointment_reminder",
  APPOINTMENT_CONFIRMED = "appointment_confirmed",
  APPOINTMENT_CANCELLED = "appointment_cancelled",
  PRESCRIPTION_ISSUED = "prescription_issued",
  PRESCRIPTION_FULFILLED = "prescription_fulfilled",
  HOSPITAL_VERIFIED = "hospital_verified",
  CONSENT_REQUESTED = "consent_requested",
  PAYMENT_RECEIVED = "payment_received",
  SYSTEM_ALERT = "system_alert",
}
