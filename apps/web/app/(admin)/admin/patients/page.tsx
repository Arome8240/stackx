'use client';

export default function PatientsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Patient Management</h1>
        <p className="text-gray-400">View and manage registered patients</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-2">Coming Soon</h3>
        <p className="text-gray-300 mb-4">
          Patient management features are under development. This page will allow you to:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>View all registered patients</li>
          <li>Search and filter patients</li>
          <li>View patient medical records (with consent)</li>
          <li>Monitor patient activity</li>
          <li>Manage access permissions</li>
        </ul>
      </div>
    </div>
  );
}
