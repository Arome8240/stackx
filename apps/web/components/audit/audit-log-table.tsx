'use client';

import { useState } from 'react';
import type { AuditLog } from '@/lib/types/audit';
import { getActionTypeLabel, getSeverityColor, getActionTypeIcon } from '@/lib/types/audit';

interface AuditLogTableProps {
  logs: AuditLog[];
  loading?: boolean;
}

export function AuditLogTable({ logs, loading }: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                No audit logs found. Logs will appear here once system activity begins.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(log.timestamp * 1000).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Block #{log.blockHeight}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getActionTypeIcon(log.actionType)}</span>
                        <span className="text-sm font-medium">
                          {getActionTypeLabel(log.actionType)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getSeverityColor(
                          log.severity
                        )}`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-300">
                        {log.actor.slice(0, 8)}...{log.actor.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-md truncate">
                        {log.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          log.success ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {log.success ? '✓ Success' : '✗ Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {logs.length > 0 && (
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            Showing {logs.length} audit log{logs.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getActionTypeIcon(selectedLog.actionType)}</span>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {getActionTypeLabel(selectedLog.actionType)}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(selectedLog.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                <p className="text-gray-300">{selectedLog.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Severity</h4>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getSeverityColor(
                      selectedLog.severity
                    )}`}
                  >
                    {selectedLog.severity}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                  <span
                    className={`text-sm font-medium ${
                      selectedLog.success ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {selectedLog.success ? '✓ Success' : '✗ Failed'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Actor</h4>
                <p className="text-sm font-mono text-gray-300">{selectedLog.actor}</p>
              </div>

              {selectedLog.target && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Target</h4>
                  <p className="text-sm font-mono text-gray-300">{selectedLog.target}</p>
                </div>
              )}

              {selectedLog.txId && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Transaction ID</h4>
                  <p className="text-sm font-mono text-gray-300">{selectedLog.txId}</p>
                </div>
              )}

              {selectedLog.blockHeight && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Block Height</h4>
                  <p className="text-sm text-gray-300">{selectedLog.blockHeight}</p>
                </div>
              )}

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Metadata</h4>
                  <pre className="text-xs bg-gray-900 p-3 rounded border border-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
