'use client';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-gray-400">Configure platform parameters</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6 mb-6">
        <h3 className="text-blue-400 font-semibold mb-2">Coming Soon</h3>
        <p className="text-gray-300 mb-4">
          Settings management features are under development. This page will allow you to:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Update platform fees and pricing</li>
          <li>Configure appointment parameters</li>
          <li>Manage specialty categories</li>
          <li>Set emergency access controls</li>
          <li>Configure notification settings</li>
          <li>Manage system maintenance mode</li>
        </ul>
      </div>

      {/* Current Configuration */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Current Configuration</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
            <div>
              <p className="font-medium">Network</p>
              <p className="text-sm text-gray-400">Blockchain network</p>
            </div>
            <span className="px-3 py-1 bg-blue-600 rounded text-sm capitalize">
              {process.env.NEXT_PUBLIC_NETWORK || 'testnet'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
            <div>
              <p className="font-medium">Contract Address</p>
              <p className="text-sm text-gray-400">Main contract deployment</p>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not configured'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
            <div>
              <p className="font-medium">Deployer Address</p>
              <p className="text-sm text-gray-400">Super admin address</p>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || 'Not configured'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
