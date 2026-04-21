'use client';

export default function PrescriptionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prescriptions Management</h1>
        <p className="text-gray-400">Monitor prescriptions and pharmacy activity</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-2">Coming Soon</h3>
        <p className="text-gray-300 mb-4">
          Prescription management features are under development. This page will allow you to:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>View all issued prescriptions</li>
          <li>Monitor prescription fulfillment</li>
          <li>Manage pharmacy registrations</li>
          <li>Track expired prescriptions</li>
          <li>View prescription statistics</li>
        </ul>
      </div>
    </div>
  );
}
