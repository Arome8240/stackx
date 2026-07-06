'use client';

import { AuditLogTable } from '@/components/audit/audit-log-table';
import { AuditLogFilters } from '@/components/audit/audit-log-filters';
import { useAuditLogs } from '@/lib/hooks/use-audit-logs';
import { exportToCSV, exportToJSON } from '@/lib/utils/export';
import { useState } from 'react';

export default function AuditPage() {
  const { logs, allLogs, stats, loading, error, filter, setFilter, refetch } = useAuditLogs();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleClearFilters = () => {
    setFilter({});
  };

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = logs.map((log) => ({
      timestamp: new Date(log.timestamp * 1000).toISOString(),
      actionType: log.actionType,
      severity: log.severity,
      actor: log.actor,
      target: log.target || '',
      description: log.description,
      status: log.success ? 'success' : 'failed',
      txId: log.txId || '',
      blockHeight: log.blockHeight || '',
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'audit-logs');
    } else {
      exportToJSON(exportData, 'audit-logs');
    }

    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-gray-400 mt-2">
            Complete audit trail of all system activities and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>📥</span>
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-t-lg"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-b-lg"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-400 mb-2">📊 Mock Data</h3>
        <p className="text-gray-300 text-sm">
          Currently displaying mock audit logs for demonstration. Real audit data will be available
          after testnet deployment and event indexing implementation.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Total Logs</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalLogs}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Recent Activity</h3>
          <p className="text-3xl font-bold mt-2">{stats.recentActivity}</p>
          <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Critical Events</h3>
          <p className="text-3xl font-bold mt-2 text-accent-foreground">{stats.criticalEvents}</p>
          <p className="text-sm text-gray-500 mt-1">Requires attention</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Filtered Results</h3>
          <p className="text-3xl font-bold mt-2">{logs.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {logs.length === allLogs.length ? 'No filters' : 'Active filters'}
          </p>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Severity Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-600">
            <div>
              <p className="text-sm text-gray-400">Info</p>
              <p className="text-2xl font-bold text-blue-400">{stats.bySeverity.info || 0}</p>
            </div>
            <span className="text-3xl">ℹ️</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-900/20 rounded-lg border border-yellow-600">
            <div>
              <p className="text-sm text-gray-400">Warning</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.bySeverity.warning || 0}</p>
            </div>
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-600">
            <div>
              <p className="text-sm text-gray-400">Error</p>
              <p className="text-2xl font-bold text-red-400">{stats.bySeverity.error || 0}</p>
            </div>
            <span className="text-3xl">❌</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border border-accent">
            <div>
              <p className="text-sm text-gray-400">Critical</p>
              <p className="text-2xl font-bold text-accent-foreground">
                {stats.bySeverity.critical || 0}
              </p>
            </div>
            <span className="text-3xl">🚨</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AuditLogFilters
        filter={filter}
        onFilterChange={setFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Audit Log Table */}
      <AuditLogTable logs={logs} loading={loading} />
    </div>
  );
}
