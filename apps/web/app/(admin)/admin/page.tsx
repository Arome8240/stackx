'use client';

import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats';
import Link from 'next/link';

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-300">{error}</p>
        <p className="text-sm text-gray-400 mt-2">
          Make sure contracts are deployed and NEXT_PUBLIC_CONTRACT_ADDRESS is set in .env
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Hospitals',
      value: stats.totalHospitals,
      change: `${stats.activeHospitals} active`,
      color: 'blue',
      link: '/admin/hospitals',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingHospitals,
      change: stats.pendingHospitals > 0 ? 'Requires action' : 'All clear',
      color: stats.pendingHospitals > 0 ? 'yellow' : 'green',
      link: '/admin/hospitals?filter=pending',
    },
    {
      title: 'Active Hospitals',
      value: stats.activeHospitals,
      change: `${stats.suspendedHospitals} suspended`,
      color: 'green',
      link: '/admin/hospitals?filter=active',
    },
    {
      title: 'Registered Patients',
      value: stats.totalPatients,
      change: 'Coming soon',
      color: 'purple',
      link: '/admin/patients',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      change: 'Coming soon',
      color: 'indigo',
      link: '/admin/appointments',
    },
    {
      title: 'Prescriptions Issued',
      value: stats.totalPrescriptions,
      change: 'Coming soon',
      color: 'pink',
      link: '/admin/prescriptions',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          {stats.totalHospitals > 0
            ? 'Overview of the Staxial Health platform'
            : 'No data available. Deploy contracts to get started.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold mb-2">{stat.value}</p>
            <p className={`text-sm text-${stat.color}-400`}>{stat.change}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      {stats.pendingHospitals > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2 text-yellow-400">Action Required</h2>
          <p className="text-gray-300 mb-4">
            You have {stats.pendingHospitals} hospital{stats.pendingHospitals !== 1 ? 's' : ''} waiting for approval.
          </p>
          <Link
            href="/admin/hospitals?filter=pending"
            className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
          >
            Review Pending Hospitals
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {stats.totalHospitals > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="font-medium">Hospital Registry Active</p>
                <p className="text-sm text-gray-400">
                  {stats.totalHospitals} hospital{stats.totalHospitals !== 1 ? 's' : ''} registered on the platform
                </p>
              </div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
            {stats.pendingHospitals > 0 && (
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <p className="font-medium">Pending Approvals</p>
                  <p className="text-sm text-gray-400">
                    {stats.pendingHospitals} hospital{stats.pendingHospitals !== 1 ? 's' : ''} awaiting verification
                  </p>
                </div>
                <span className="text-sm text-yellow-400">Action needed</span>
              </div>
            )}
            {stats.activeHospitals > 0 && (
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Active Hospitals</p>
                  <p className="text-sm text-gray-400">
                    {stats.activeHospitals} verified hospital{stats.activeHospitals !== 1 ? 's' : ''} operational
                  </p>
                </div>
                <span className="text-sm text-green-400">Operational</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No activity yet</p>
            <p className="text-sm text-gray-500">
              Deploy contracts and register hospitals to see activity here
            </p>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Contract Address</p>
              <p className="text-xs font-mono mt-1">
                {config.contractAddress || 'Not configured'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${config.contractAddress ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Network</p>
              <p className="text-xs font-mono mt-1 capitalize">
                {process.env.NEXT_PUBLIC_NETWORK || 'testnet'}
              </p>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import config at the top level for system status
import { useStacksSDK } from '@/lib/hooks/use-stacks-sdk';
const config = { contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS };
