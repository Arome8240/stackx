'use client';

import { useState } from 'react';
import { usePrescriptions } from '@/lib/hooks/use-prescriptions';
import { getPrescriptionStatusColor } from '@/lib/sdk/prescriptions-sdk';

export default function PrescriptionsPage() {
  const { prescriptions, loading, error, refetch } = usePrescriptions();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<number | null>(null);

  const filteredPrescriptions = prescriptions.filter(
    (rx) => statusFilter === 'all' || rx.status.toLowerCase() === statusFilter
  );

  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter((p) => p.status.toLowerCase() === 'active').length,
    fulfilled: prescriptions.filter((p) => p.status.toLowerCase() === 'fulfilled').length,
    expired: prescriptions.filter((p) => p.status.toLowerCase() === 'expired').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions Management</h1>
          <p className="text-gray-400 mt-2">
            Monitor and manage all platform prescriptions
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Note</h3>
        <p className="text-gray-300 text-sm">
          Prescription data requires blockchain event indexing. Currently showing placeholder data.
          After testnet deployment, implement event indexing to track all prescriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Total</h3>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">All prescriptions</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Active</h3>
          <p className="text-3xl font-bold mt-2 text-green-400">{stats.active}</p>
          <p className="text-sm text-gray-500 mt-1">Currently valid</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Fulfilled</h3>
          <p className="text-3xl font-bold mt-2 text-blue-400">{stats.fulfilled}</p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Expired</h3>
          <p className="text-3xl font-bold mt-2 text-red-400">{stats.expired}</p>
          <p className="text-sm text-gray-500 mt-1">No longer valid</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Prescription List</h2>
            <div className="flex gap-2">
              {['all', 'active', 'fulfilled', 'expired'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-400">Loading prescriptions...</p>
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {statusFilter === 'all'
                  ? 'No prescriptions found. Prescriptions will appear here once doctors start issuing them.'
                  : `No ${statusFilter} prescriptions found.`}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Issued
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expires
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
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">#{prescription.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-300">
                        {prescription.patient.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-300">
                        {prescription.hospital.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{prescription.doctor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm max-w-xs truncate">
                        {prescription.diagnosis}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {new Date(prescription.issuedAt * 1000).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {new Date(prescription.expiresAt * 1000).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getPrescriptionStatusColor(
                          prescription.status
                        )}`}
                      >
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedPrescription(prescription.id)}
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
      </div>

      {selectedPrescription !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">
                  Prescription #{selectedPrescription}
                </h3>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-400">
                Detailed prescription information and medications will be displayed here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
