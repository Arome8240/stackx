// Appointment-related types

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  DISPUTED = "disputed",
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
  status: AppointmentStatus;
  notes?: string;
  cancelledBy?: string;
  cancelledAt?: number;
  completedAt?: number;
  createdAt: number;
}

export interface AppointmentBooking {
  hospitalId: number;
  doctorId: string;
  scheduledTime: number;
  duration: number;
  notes?: string;
}

export interface AppointmentPayment {
  appointmentId: number;
  amount: bigint;
  platformFee: bigint;
  paidBy: string;
  paidAt: number;
  refunded: boolean;
  refundedAt?: number;
}

export interface Dispute {
  appointmentId: number;
  raisedBy: string;
  reason: string;
  raisedAt: number;
  resolved: boolean;
  resolvedAt?: number;
  resolution?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  hospitalId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  available: boolean;
}
