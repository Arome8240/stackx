'use client';

import { useState } from 'react';
import { useHospitals } from '@/lib/hooks/use-hospitals';
import { useContractCall } from '@/lib/hooks/use-contract-call';
import { TransactionModal } from '@/components/transaction-modal';
import type { Hospital } from '@/lib/types/sdk';

export default function HospitalsPage() {
  // For demo, we'll fetch hospitals with IDs 1-10
  // In production, you'd have a way to get all hospital IDs
  const hospitalIds = Array.from({ length: 10 }, (_, i) => i + 1);
  const { hospitals, loading, error, refetch } = useHospitals(hospitalIds);
  const {
    approveHospital,
    suspendHospital,
    reactivateHospital,
    rejectHospital,
    loading: txLoading,
    error: txError,
    txId,
    reset: resetTx,
  } = useContractCall();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txTitle, setTxTitle] = useState('');

  const filteredHospitals = hospitals.filter((h) => {
    if (filter === 'all') return true;
    return h.status === filter;
  });

  const handleApprove = async (hospitalId: number) => {
    setTxTitle('Approve Hospital');
    setTxModalOpen(true);
    resetTx();
    await approveHospital(hospitalId);
    // Refetch hospitals after transaction
    setTimeout(() => refetch?.(), 3000);
  };

  const handleReject = async (hospitalId: number) => {
    if (!confirm('Are you sure you want to reject this hospital? This action cannot be undone.')) {
      return;
    }
    setTxTitle('Reject Hospital');
    setTxModalOpen(true);
    resetTx();
    await rejectHospital(hospitalId);
    setTimeout(() => refetch?.(), 3000);
  };

  const handleSuspend = async (hospitalId: number) => {
    if (!confirm('Are you sure you want to suspend this hospital?')) {
      return;
    }
    setTxTitle('Suspend Hospital');
    setTxModalOpen(true);
    resetTx();
    await suspendHospital(hospitalId);
    setTimeout(() => refetch?.(), 3000);
  };

  const handleReactivate = async (hospitalId: number) => {
    setTxTitle('Reactivate Hospital');
    setTxModalOpen(true);
    resetTx();
    await reactivateHospital(hospitalId);
    setTimeout(() => refetch?.(), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'active':
        return 'bg-green-600';
      case 'suspended':
        return 'bg-red-600';
      case 'revoked':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error Loading Hospitals</h3>
        <p className="text-gray-300">{error}</p>
        <p className="text-sm text-gray-400 mt-2">
          Make sure contracts are deployed and NEXT_PUBLIC_CONTRACT_ADDRESS is set in .env
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hospital Management</h1>
        <p className="text-gray-400">
          {hospitals.length > 0 
            ? `Managing ${hospitals.length} registered hospitals`
            : 'No hospitals found. Contracts may not be deployed yet.'}
        </p>
      </div>

      {hospitals.length > 0 && (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'active', 'suspended'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {f} ({hospitals.filter(h => f === 'all' || h.status === f).length})
              </button>
            ))}
          </div>

          {/* Hospitals Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        <p className="text-sm text-gray-400">ID: {hospital.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{hospital.licenseNumber}</td>
                    <td className="px-6 py-4 text-sm">{hospital.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          hospital.status
                        )}`}
                      >
                        {hospital.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {hospital.rating > 0 ? `⭐ ${hospital.rating}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {hospital.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(hospital.id)}
                              disabled={txLoading}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(hospital.id)}
                              disabled={txLoading}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {hospital.status === 'active' && (
                          <button
                            onClick={() => handleSuspend(hospital.id)}
                            disabled={txLoading}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                        {hospital.status === 'suspended' && (
                          <button
                            onClick={() => handleReactivate(hospital.id)}
                            disabled={txLoading}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedHospital(hospital)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedHospital.name}</h2>
              <button
                onClick={() => setSelectedHospital(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Hospital ID</label>
                <p className="font-medium">{selectedHospital.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Owner Address</label>
                <p className="font-medium text-sm break-all">{selectedHospital.owner}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">License Number</label>
                <p className="font-medium">{selectedHospital.licenseNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Location</label>
                <p className="font-medium">{selectedHospital.location}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <p className="font-medium capitalize">{selectedHospital.status}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Verified</label>
                <p className="font-medium">{selectedHospital.verified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Stake Amount</label>
                <p className="font-medium">{selectedHospital.stake.toString()} tokens</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Rating</label>
                <p className="font-medium">
                  {selectedHospital.rating > 0 
                    ? `${selectedHospital.rating}/5 (${selectedHospital.totalRatings} ratings)`
                    : 'No ratings yet'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Registered At Block</label>
                <p className="font-medium">{selectedHospital.registeredAt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        loading={txLoading}
        error={txError}
        txId={txId}
        title={txTitle}
      />
    </div>
  );
}
