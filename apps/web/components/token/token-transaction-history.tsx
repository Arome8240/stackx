'use client';

import { useState } from 'react';

interface TokenTransaction {
  txId: string;
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'mint' | 'burn' | 'stake' | 'unstake';
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

interface TokenTransactionHistoryProps {
  transactions: TokenTransaction[];
  loading?: boolean;
}

export function TokenTransactionHistory({ transactions, loading }: TokenTransactionHistoryProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter(
    (tx) => filterType === 'all' || tx.type === filterType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mint':
        return 'bg-green-900/50 text-green-400';
      case 'burn':
        return 'bg-red-900/50 text-red-400';
      case 'stake':
        return 'bg-accent text-accent-foreground';
      case 'unstake':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'transfer':
        return 'bg-blue-900/50 text-blue-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex gap-2">
            {['all', 'transfer', 'mint', 'burn', 'stake', 'unstake'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {filterType === 'all'
                ? 'No transactions found. Transactions will appear here once token operations begin.'
                : `No ${filterType} transactions found.`}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.txId} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-300">
                      {tx.txId.slice(0, 8)}...{tx.txId.slice(-6)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getTypeColor(
                        tx.type
                      )}`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-400">
                      {tx.from === 'system'
                        ? 'System'
                        : `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-400">
                      {tx.to === 'system'
                        ? 'System'
                        : `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {tx.amount.toLocaleString()} HEALTH
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium capitalize ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  );
}
