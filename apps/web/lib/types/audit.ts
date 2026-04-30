export type AuditActionType =
  | 'hospital_registered'
  | 'hospital_verified'
  | 'hospital_suspended'
  | 'hospital_reactivated'
  | 'hospital_rejected'
  | 'patient_registered'
  | 'patient_updated'
  | 'record_created'
  | 'record_accessed'
  | 'access_granted'
  | 'access_revoked'
  | 'appointment_created'
  | 'appointment_confirmed'
  | 'appointment_completed'
  | 'appointment_cancelled'
  | 'prescription_issued'
  | 'prescription_fulfilled'
  | 'prescription_cancelled'
  | 'token_minted'
  | 'token_burned'
  | 'token_transferred'
  | 'admin_action'
  | 'system_event';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLog {
  id: string;
  timestamp: number;
  actionType: AuditActionType;
  severity: AuditSeverity;
  actor: string; // Address of the user who performed the action
  target?: string; // Address or ID of the affected entity
  description: string;
  metadata?: Record<string, any>;
  txId?: string; // Transaction ID if applicable
  blockHeight?: number;
  success: boolean;
}

export interface AuditLogFilter {
  actionType?: AuditActionType | 'all';
  severity?: AuditSeverity | 'all';
  actor?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

export interface AuditLogStats {
  totalLogs: number;
  byActionType: Record<AuditActionType, number>;
  bySeverity: Record<AuditSeverity, number>;
  recentActivity: number; // Last 24 hours
  criticalEvents: number;
}

// Helper function to get action type display name
export function getActionTypeLabel(actionType: AuditActionType): string {
  const labels: Record<AuditActionType, string> = {
    hospital_registered: 'Hospital Registered',
    hospital_verified: 'Hospital Verified',
    hospital_suspended: 'Hospital Suspended',
    hospital_reactivated: 'Hospital Reactivated',
    hospital_rejected: 'Hospital Rejected',
    patient_registered: 'Patient Registered',
    patient_updated: 'Patient Updated',
    record_created: 'Medical Record Created',
    record_accessed: 'Record Accessed',
    access_granted: 'Access Granted',
    access_revoked: 'Access Revoked',
    appointment_created: 'Appointment Created',
    appointment_confirmed: 'Appointment Confirmed',
    appointment_completed: 'Appointment Completed',
    appointment_cancelled: 'Appointment Cancelled',
    prescription_issued: 'Prescription Issued',
    prescription_fulfilled: 'Prescription Fulfilled',
    prescription_cancelled: 'Prescription Cancelled',
    token_minted: 'Tokens Minted',
    token_burned: 'Tokens Burned',
    token_transferred: 'Tokens Transferred',
    admin_action: 'Admin Action',
    system_event: 'System Event',
  };
  return labels[actionType] || actionType;
}

// Helper function to get severity color
export function getSeverityColor(severity: AuditSeverity): string {
  const colors: Record<AuditSeverity, string> = {
    info: 'bg-blue-900/50 text-blue-400',
    warning: 'bg-yellow-900/50 text-yellow-400',
    error: 'bg-red-900/50 text-red-400',
    critical: 'bg-purple-900/50 text-purple-400',
  };
  return colors[severity] || 'bg-gray-700 text-gray-400';
}

// Helper function to get action type icon
export function getActionTypeIcon(actionType: AuditActionType): string {
  const icons: Record<AuditActionType, string> = {
    hospital_registered: '🏥',
    hospital_verified: '✅',
    hospital_suspended: '⏸️',
    hospital_reactivated: '▶️',
    hospital_rejected: '❌',
    patient_registered: '👤',
    patient_updated: '✏️',
    record_created: '📄',
    record_accessed: '👁️',
    access_granted: '🔓',
    access_revoked: '🔒',
    appointment_created: '📅',
    appointment_confirmed: '✔️',
    appointment_completed: '✅',
    appointment_cancelled: '🚫',
    prescription_issued: '💊',
    prescription_fulfilled: '✅',
    prescription_cancelled: '❌',
    token_minted: '➕',
    token_burned: '🔥',
    token_transferred: '💸',
    admin_action: '⚙️',
    system_event: '🔔',
  };
  return icons[actionType] || '📋';
}
