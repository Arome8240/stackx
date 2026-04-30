'use client';

import { useState } from 'react';

interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
  lastActivity: number;
}

interface TokenHoldersListProps {
  holders: TokenHolder[];
  loading?: boolean;
}

export function TokenHoldersList({ holders, loading }: TokenHoldersListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHolders = holders.filter((holder) =>
    holder.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Token Holders</h2>
          <input
            type="text"
            placeholder="Search address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg w-64 text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredHolders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? 'No holders found matching your search.'
                : 'No token holders found. Holders will appear here once tokens are distributed.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredHolders.map((holder, index) => (
                <tr key={holder.address} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">#{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-300">
                      {holder.address.slice(0, 10)}...{holder.address.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {formatNumber(holder.balance)} HEALTH
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(holder.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {holder.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {new Date(holder.lastActivity * 1000).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredHolders.length > 0 && (
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          Showing {filteredHolders.length} of {holders.length} holders
        </div>
      )}
    </div>
  );
}
