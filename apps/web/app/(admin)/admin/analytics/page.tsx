'use client';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-gray-400">Detailed insights and metrics</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-2">Coming Soon</h3>
        <p className="text-gray-300 mb-4">
          Analytics features are under development. This page will provide:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Platform usage statistics and trends</li>
          <li>Token circulation and transaction volume</li>
          <li>Hospital performance metrics</li>
          <li>Patient engagement analytics</li>
          <li>Revenue and fee analysis</li>
          <li>Interactive charts and visualizations</li>
          <li>Export reports functionality</li>
        </ul>
      </div>
    </div>
  );
}
