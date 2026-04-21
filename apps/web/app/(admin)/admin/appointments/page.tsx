'use client';

export default function AppointmentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Appointments Overview</h1>
        <p className="text-gray-400">Monitor and manage platform appointments</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-2">Coming Soon</h3>
        <p className="text-gray-300 mb-4">
          Appointment management features are under development. This page will allow you to:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>View all platform appointments</li>
          <li>Filter by status (pending, confirmed, completed, cancelled)</li>
          <li>Monitor appointment statistics</li>
          <li>Handle disputes and issues</li>
          <li>View payment and fee information</li>
        </ul>
      </div>
    </div>
  );
}
