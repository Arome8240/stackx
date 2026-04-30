'use client';

import { useState } from 'react';
import type { AuditLogFilter, AuditActionType, AuditSeverity } from '@/lib/types/audit';

interface AuditLogFiltersProps {
  filter: AuditLogFilter;
  onFilterChange: (filter: AuditLogFilter) => void;
  onClearFilters: () => void;
}

const actionTypes: Array<{ value: AuditActionType | 'all'; label: string }> = [
  { value: 'all', label: 'All Actions' },
  { value: 'hospital_registered', label: 'Hospital Registered' },
  { value: 'hospital_verified', label: 'Hospital Verified' },
  { value: 'hospital_suspended', label: 'Hospital Suspended' },
  { value: 'patient_registered', label: 'Patient Registered' },
  { value: 'appointment_created', label: 'Appointment Created' },
  { value: 'prescription_issued', label: 'Prescription Issued' },
  { value: 'token_minted', label: 'Tokens Minted' },
  { value: 'token_burned', label: 'Tokens Burned' },
  { value: 'admin_action', label: 'Admin Action' },
];

const severities: Array<{ value: AuditSeverity | 'all'; label: string }> = [
  { value: 'all', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'critical', label: 'Critical' },
];

export function AuditLogFilters({ filter, onFilterChange, onClearFilters }: AuditLogFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleActionTypeChange = (actionType: AuditActionType | 'all') => {
    onFilterChange({ ...filter, actionType });
  };

  const handleSeverityChange = (severity: AuditSeverity | 'all') => {
    onFilterChange({ ...filter, severity });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFilterChange({ ...filter, searchTerm });
  };

  const handleActorChange = (actor: string) => {
    onFilterChange({ ...filter, actor });
  };

  const handleStartDateChange = (date: string) => {
    onFilterChange({ ...filter, startDate: date ? new Date(date) : undefined });
  };

  const handleEndDateChange = (date: string) => {
    onFilterChange({ ...filter, endDate: date ? new Date(date) : undefined });
  };

  const hasActiveFilters =
    (filter.actionType && filter.actionType !== 'all') ||
    (filter.severity && filter.severity !== 'all') ||
    filter.searchTerm ||
    filter.actor ||
    filter.startDate ||
    filter.endDate;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Action Type</label>
          <select
            value={filter.actionType || 'all'}
            onChange={(e) => handleActionTypeChange(e.target.value as AuditActionType | 'all')}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            {actionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
          <select
            value={filter.severity || 'all'}
            onChange={(e) => handleSeverityChange(e.target.value as AuditSeverity | 'all')}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            {severities.map((sev) => (
              <option key={sev.value} value={sev.value}>
                {sev.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
          <input
            type="text"
            value={filter.searchTerm || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search logs..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
      >
        {showAdvanced ? '▼' : '▶'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Actor Address</label>
            <input
              type="text"
              value={filter.actor || ''}
              onChange={(e) => handleActorChange(e.target.value)}
              placeholder="Filter by actor..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
            <input
              type="datetime-local"
              value={filter.startDate ? filter.startDate.toISOString().slice(0, 16) : ''}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
            <input
              type="datetime-local"
              value={filter.endDate ? filter.endDate.toISOString().slice(0, 16) : ''}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
          {filter.actionType && filter.actionType !== 'all' && (
            <span className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-sm flex items-center gap-2">
              Action: {actionTypes.find((t) => t.value === filter.actionType)?.label}
              <button
                onClick={() => handleActionTypeChange('all')}
                className="hover:text-blue-300"
              >
                ✕
              </button>
            </span>
          )}
          {filter.severity && filter.severity !== 'all' && (
            <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-sm flex items-center gap-2">
              Severity: {filter.severity}
              <button
                onClick={() => handleSeverityChange('all')}
                className="hover:text-yellow-300"
              >
                ✕
              </button>
            </span>
          )}
          {filter.searchTerm && (
            <span className="px-3 py-1 bg-purple-900/50 text-purple-400 rounded-full text-sm flex items-center gap-2">
              Search: {filter.searchTerm}
              <button onClick={() => handleSearchChange('')} className="hover:text-purple-300">
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
