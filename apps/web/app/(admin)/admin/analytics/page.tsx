'use client';

import { useState } from 'react';
import { HospitalGrowthChart } from '@/components/charts/hospital-growth-chart';
import { AppointmentVolumeChart } from '@/components/charts/appointment-volume-chart';
import { TokenCirculationChart } from '@/components/charts/token-circulation-chart';

// Mock data - will be replaced with real data from blockchain
const generateMockHospitalData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    date: month,
    total: (index + 1) * 2,
    active: (index + 1) * 1.5,
    pending: Math.max(0, (index + 1) * 0.5),
  }));
};

const generateMockAppointmentData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    date: month,
    completed: (index + 1) * 15,
    confirmed: (index + 1) * 8,
    cancelled: (index + 1) * 2,
  }));
};

const generateMockTokenData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    date: month,
    totalSupply: 1000000 + (index * 50000),
    staked: 300000 + (index * 20000),
    circulating: 700000 + (index * 30000),
  }));
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const hospitalData = generateMockHospitalData();
  const appointmentData = generateMockAppointmentData();
  const tokenData = generateMockTokenData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-gray-400 mt-2">
            Detailed insights and metrics across the platform
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range === '7d' && '7 Days'}
              {range === '30d' && '30 Days'}
              {range === '90d' && '90 Days'}
              {range === '1y' && '1 Year'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-400 mb-2">📊 Mock Data</h3>
        <p className="text-gray-300 text-sm">
          Currently displaying mock data for visualization. Real data will be available after
          testnet deployment and event indexing implementation.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">1,234 STX</p>
          <p className="text-sm text-green-400 mt-1">+12.5% from last month</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
          <p className="text-3xl font-bold mt-2">456</p>
          <p className="text-sm text-green-400 mt-1">+8.3% from last month</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Transactions</h3>
          <p className="text-3xl font-bold mt-2">2,345</p>
          <p className="text-sm text-green-400 mt-1">+15.7% from last month</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Avg. Fee</h3>
          <p className="text-3xl font-bold mt-2">0.5 STX</p>
          <p className="text-sm text-gray-400 mt-1">No change</p>
        </div>
      </div>

      {/* Hospital Growth Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Hospital Growth</h2>
          <p className="text-sm text-gray-400 mt-1">
            Track hospital registrations and status changes over time
          </p>
        </div>
        <HospitalGrowthChart data={hospitalData} />
      </div>

      {/* Appointment Volume Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Appointment Volume</h2>
          <p className="text-sm text-gray-400 mt-1">
            Monitor appointment bookings and completion rates
          </p>
        </div>
        <AppointmentVolumeChart data={appointmentData} />
      </div>

      {/* Token Circulation Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Token Circulation</h2>
          <p className="text-sm text-gray-400 mt-1">
            Visualize token supply, staking, and circulation metrics
          </p>
        </div>
        <TokenCirculationChart data={tokenData} />
      </div>

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Hospitals</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Hospital #{i}</p>
                  <p className="text-sm text-gray-400">
                    {50 - i * 5} appointments completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">{100 - i * 10} STX</p>
                  <p className="text-sm text-gray-400">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Hospital Registered', time: '2 hours ago', type: 'success' },
              { action: 'Appointment Booked', time: '3 hours ago', type: 'info' },
              { action: 'Prescription Issued', time: '5 hours ago', type: 'info' },
              { action: 'Hospital Verified', time: '6 hours ago', type: 'success' },
              { action: 'Patient Registered', time: '8 hours ago', type: 'info' },
            ].map((activity, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                    }`}
                  />
                  <p className="text-sm">{activity.action}</p>
                </div>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
