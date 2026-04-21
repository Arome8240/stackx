'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalHospitals: number;
  pendingHospitals: number;
  totalPatients: number;
  totalAppointments: number;
  totalPrescriptions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalHospitals: 0,
    pendingHospitals: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
  });

  useEffect(() => {
    // TODO: Fetch stats from contracts
    // For now, using placeholder data
    setStats({
      totalHospitals: 12,
      pendingHospitals: 3,
      totalPatients: 245,
      totalAppointments: 89,
      totalPrescriptions: 156,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Hospitals',
      value: stats.totalHospitals,
      change: '+2 this month',
      color: 'blue',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingHospitals,
      change: 'Requires action',
      color: 'yellow',
    },
    {
      title: 'Registered Patients',
      value: stats.totalPatients,
      change: '+18 this week',
      color: 'green',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      change: '+12 today',
      color: 'purple',
    },
    {
      title: 'Prescriptions Issued',
      value: stats.totalPrescriptions,
      change: '+23 this week',
      color: 'pink',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of the Staxial Health platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold mb-2">{stat.value}</p>
            <p className={`text-sm text-${stat.color}-400`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="font-medium">New Hospital Registration</p>
              <p className="text-sm text-gray-400">City General Hospital</p>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="font-medium">Appointment Completed</p>
              <p className="text-sm text-gray-400">Patient consultation at Metro Clinic</p>
            </div>
            <span className="text-sm text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Prescription Issued</p>
              <p className="text-sm text-gray-400">Dr. Smith issued prescription #156</p>
            </div>
            <span className="text-sm text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
