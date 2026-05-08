import { useState, useEffect, useMemo } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import type { AuditLog, AuditLogFilter, AuditLogStats, AuditActionType, AuditSeverity } from '../types/audit';

/**
 * Fetch audit logs from blockchain events
 * In production, this would query an indexer or backend API
 */
// async function fetchAuditLogsFromBlockchain(): Promise<AuditLog[]> {
//   // Placeholder - would fetch from blockchain events or indexer
//   // For now, returning empty array
//   return [];
// }

/**
 * Generate mock audit logs for demonstration
 */
function generateMockAuditLogs(): AuditLog[] {
  const now = Date.now() / 1000;
  const mockLogs: AuditLog[] = [];

  // Generate some sample logs
  const actions: Array<{ type: AuditActionType; severity: AuditSeverity; desc: string }> = [
    { type: 'hospital_registered', severity: 'info', desc: 'New hospital registration submitted' },
    { type: 'hospital_verified', severity: 'info', desc: 'Hospital verification approved by admin' },
    { type: 'patient_registered', severity: 'info', desc: 'New patient registered on platform' },
    { type: 'appointment_created', severity: 'info', desc: 'Appointment booked successfully' },
    { type: 'prescription_issued', severity: 'info', desc: 'Prescription issued by doctor' },
    { type: 'hospital_suspended', severity: 'warning', desc: 'Hospital suspended due to policy violation' },
    { type: 'access_revoked', severity: 'warning', desc: 'Patient revoked hospital access to records' },
    { type: 'appointment_cancelled', severity: 'warning', desc: 'Appointment cancelled by patient' },
    { type: 'token_minted', severity: 'info', desc: 'Admin minted new tokens' },
    { type: 'admin_action', severity: 'critical', desc: 'Admin performed system configuration change' },
  ];

  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    mockLogs.push({
      id: `log-${i}`,
      timestamp: now - (i * 3600), // 1 hour apart
      actionType: action.type,
      severity: action.severity,
      actor: `SP${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      target: Math.random() > 0.5 ? `SP${Math.random().toString(36).substring(2, 15).toUpperCase()}` : undefined,
      description: action.desc,
      txId: `0x${Math.random().toString(16).substring(2, 15)}`,
      blockHeight: 1000000 + i,
      success: Math.random() > 0.1, // 90% success rate
      metadata: {
        source: 'mock',
      },
    });
  }

  return mockLogs.sort((a, b) => b.timestamp - a.timestamp);
}

export function useAuditLogs(initialFilter?: AuditLogFilter) {
  const { network, contractAddress } = useStacksSDK();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AuditLogFilter>(initialFilter || {});

  const fetchLogs = async () => {
    if (!network || !contractAddress) {
      setError('SDK not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In production, fetch from blockchain or indexer
      // const auditLogs = await fetchAuditLogsFromBlockchain();
      
      // For now, use mock data
      const auditLogs = generateMockAuditLogs();
      setLogs(auditLogs);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [network, contractAddress]);

  // Filter logs based on current filter
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    if (filter.actionType && filter.actionType !== 'all') {
      filtered = filtered.filter((log) => log.actionType === filter.actionType);
    }

    if (filter.severity && filter.severity !== 'all') {
      filtered = filtered.filter((log) => log.severity === filter.severity);
    }

    if (filter.actor) {
      filtered = filtered.filter((log) =>
        log.actor.toLowerCase().includes(filter.actor!.toLowerCase())
      );
    }

    if (filter.startDate) {
      const startTimestamp = filter.startDate.getTime() / 1000;
      filtered = filtered.filter((log) => log.timestamp >= startTimestamp);
    }

    if (filter.endDate) {
      const endTimestamp = filter.endDate.getTime() / 1000;
      filtered = filtered.filter((log) => log.timestamp <= endTimestamp);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.description.toLowerCase().includes(term) ||
          log.actor.toLowerCase().includes(term) ||
          log.target?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [logs, filter]);

  // Calculate statistics
  const stats = useMemo((): AuditLogStats => {
    const now = Date.now() / 1000;
    const last24Hours = now - 86400;

    const byActionType = logs.reduce((acc, log) => {
      acc[log.actionType] = (acc[log.actionType] || 0) + 1;
      return acc;
    }, {} as Record<AuditActionType, number>);

    const bySeverity = logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<AuditSeverity, number>);

    return {
      totalLogs: logs.length,
      byActionType,
      bySeverity,
      recentActivity: logs.filter((log) => log.timestamp >= last24Hours).length,
      criticalEvents: logs.filter((log) => log.severity === 'critical').length,
    };
  }, [logs]);

  return {
    logs: filteredLogs,
    allLogs: logs,
    stats,
    loading,
    error,
    filter,
    setFilter,
    refetch: fetchLogs,
  };
}
