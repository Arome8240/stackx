'use client';

import { useState } from 'react';
import { TokenStatistics } from '@/components/token/token-statistics';
import { TokenHoldersList } from '@/components/token/token-holders-list';
import { TokenTransactionHistory } from '@/components/token/token-transaction-history';
import { useTokenStats, useTokenHolders, useTokenTransactions, useTokenOperations } from '@/lib/hooks/use-token';

export default function TokensPage() {
  const { stats, loading: statsLoading, refetch: refetchStats } = useTokenStats();
  const { holders, loading: holdersLoading, refetch: refetchHolders } = useTokenHolders();
  const { transactions, loading: txLoading, refetch: refetchTransactions } = useTokenTransactions();
  const { mint, burn, loading: operationLoading } = useTokenOperations();

  const [showMintModal, setShowMintModal] = useState(false);
  const [showBurnModal, setShowBurnModal] = useState(false);
  const [mintAmount, setMintAmount] = useState('');
  const [mintRecipient, setMintRecipient] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [operationResult, setOperationResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleMint = async () => {
    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      setOperationResult({ success: false, message: 'Invalid amount' });
      return;
    }
    if (!mintRecipient) {
      setOperationResult({ success: false, message: 'Recipient address required' });
      return;
    }

    const result = await mint(amount, mintRecipient);
    setOperationResult({
      success: result.success,
      message: result.success ? `Successfully minted ${amount} tokens` : result.error || 'Mint failed',
    });

    if (result.success) {
      setMintAmount('');
      setMintRecipient('');
      setShowMintModal(false);
      refetchStats();
      refetchTransactions();
    }
  };

  const handleBurn = async () => {
    const amount = parseFloat(burnAmount);
    if (isNaN(amount) || amount <= 0) {
      setOperationResult({ success: false, message: 'Invalid amount' });
      return;
    }

    const result = await burn(amount);
    setOperationResult({
      success: result.success,
      message: result.success ? `Successfully burned ${amount} tokens` : result.error || 'Burn failed',
    });

    if (result.success) {
      setBurnAmount('');
      setShowBurnModal(false);
      refetchStats();
      refetchTransactions();
    }
  };

  const refreshAll = () => {
    refetchStats();
    refetchHolders();
    refetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Token Management</h1>
          <p className="text-gray-400 mt-2">
            Manage HEALTH token supply, holders, and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMintModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <span>➕</span>
            Mint Tokens
          </button>
          <button
            onClick={() => setShowBurnModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <span>🔥</span>
            Burn Tokens
          </button>
          <button
            onClick={refreshAll}
            disabled={statsLoading || holdersLoading || txLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {operationResult && (
        <div
          className={`rounded-lg p-4 ${
            operationResult.success
              ? 'bg-green-900/20 border border-green-600'
              : 'bg-red-900/20 border border-red-600'
          }`}
        >
          <p
            className={`text-sm ${
              operationResult.success ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {operationResult.message}
          </p>
        </div>
      )}

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Note</h3>
        <p className="text-gray-300 text-sm">
          Token data requires blockchain event indexing. Currently showing placeholder data.
          Mint and burn functions will be available after testnet deployment.
        </p>
      </div>

      {/* Token Statistics */}
      <TokenStatistics stats={stats || {
        totalSupply: 0,
        circulatingSupply: 0,
        totalStaked: 0,
        totalHolders: 0,
      }} loading={statsLoading} />

      {/* Token Holders */}
      <TokenHoldersList holders={holders} loading={holdersLoading} />

      {/* Transaction History */}
      <TokenTransactionHistory transactions={transactions} loading={txLoading} />

      {/* Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">Mint Tokens</h3>
                <button
                  onClick={() => {
                    setShowMintModal(false);
                    setOperationResult(null);
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  placeholder="Enter amount to mint"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={mintRecipient}
                  onChange={(e) => setMintRecipient(e.target.value)}
                  placeholder="Enter recipient address"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ This action requires admin privileges and will be recorded on the blockchain.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleMint}
                  disabled={operationLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {operationLoading ? 'Minting...' : 'Mint Tokens'}
                </button>
                <button
                  onClick={() => {
                    setShowMintModal(false);
                    setOperationResult(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Burn Modal */}
      {showBurnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">Burn Tokens</h3>
                <button
                  onClick={() => {
                    setShowBurnModal(false);
                    setOperationResult(null);
                  }}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="Enter amount to burn"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  ⚠️ This action is irreversible. Burned tokens will be permanently removed from circulation.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBurn}
                  disabled={operationLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {operationLoading ? 'Burning...' : 'Burn Tokens'}
                </button>
                <button
                  onClick={() => {
                    setShowBurnModal(false);
                    setOperationResult(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
