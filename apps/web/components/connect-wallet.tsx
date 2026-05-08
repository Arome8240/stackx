'use client';

import { useConnect } from '@stacks/connect-react';
import { useStacks } from './providers/stacks-provider';

export function ConnectWallet() {
  const { authenticate } = useConnect();
  const { isAuthenticated, userAddress, isAdmin, disconnect } = useStacks();

  if (isAuthenticated && userAddress) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-400">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
          {isAdmin && (
            <span className="text-xs text-green-400 font-semibold">Super Admin</span>
          )}
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => authenticate({ appDetails: { name: 'StackX', icon: '' } })}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
    >
      Connect Wallet
    </button>
  );
}
