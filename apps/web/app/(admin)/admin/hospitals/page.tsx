'use client';

import { useEffect, useState } from 'react';

interface Hospital {
  id: number;
  name: string;
  licenseNumber: string;
  location: string;
  status: 'pending' | 'active' | 'suspended' | 'revoked';
  verified: boolean;
  stake: string;
  rating: number;
  registeredAt: string;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    // TODO: Fetch hospitals from contract
    // Placeholder data
    setHospitals([
      {
        id: 1,
        name: 'City General Hospital',
        licenseNumber: 'LIC-2024-001',
        location: 'New York, NY',
        status: 'pending',
        verified: false,
        stake: '10000',
        rating: 0,
        registeredAt: '2024-01-15',
      },
      {
        id: 2,
        name: 'Metro Medical Center',
        licenseNumber: 'LIC-2024-002',
        location: 'Los Angeles, CA',
        status: 'active',
        verified: true,
        stake: '10000',
        rating: 4.5,
        registeredAt: '2024-01-10',
      },
      {
        id: 3,
        name: 'Sunrise Clinic',
        licenseNumber: 'LIC-2024-003',
        location: 'Chicago, IL',
        status: 'active',
        verified: true,
        stake: '10000',
        rating: 4.8,
        registeredAt: '2024-01-05',
      },
    ]);
  }, []);

  const filteredHospitals = hospitals.filter((h) => {
    if (filter === 'all') return true;
    return h.status === filter;
  });

  const handleApprove = async (hospitalId: number) => {
    // TODO: Call contract to verify hospital
    console.log('Approving hospital:', hospitalId);
    alert('Hospital approved! (Contract call not implemented yet)');
  };

  const handleReject = async (hospitalId: number) => {
    // TODO: Call contract to reject hospital
    console.log('Rejecting hospital:', hospitalId);
    alert('Hospital rejected! (Contract call not implemented yet)');
  };

  const handleSuspend = async (hospitalId: number) => {
    // TODO: Call contract to suspend hospital
    console.log('Suspending hospital:', hospitalId);
    alert('Hospital suspended! (Contract call not implemented yet)');
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hospital Management</h1>
        <p className="text-gray-400">Manage hospital registrations and verifications</p>
      </div>

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
            {f}
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
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(hospital.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {hospital.status === 'active' && (
                      <button
                        onClick={() => handleSuspend(hospital.id)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedHospital(hospital)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
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

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                <label className="text-sm text-gray-400">Stake Amount</label>
                <p className="font-medium">{selectedHospital.stake} tokens</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Registered At</label>
                <p className="font-medium">{selectedHospital.registeredAt}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
