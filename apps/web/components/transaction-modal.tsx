'use client';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  txId: string | null;
  title: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  loading,
  error,
  txId,
  title,
}: TransactionModalProps) {
  if (!isOpen) return null;

  const explorerUrl = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? 'https://explorer.hiro.so'
    : 'https://explorer.hiro.so/?chain=testnet';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Processing transaction...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please confirm the transaction in your wallet
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-4">
            <h3 className="text-red-400 font-semibold mb-2">Transaction Failed</h3>
            <p className="text-gray-300 text-sm">{error}</p>
          </div>
        )}

        {txId && (
          <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-4">
            <h3 className="text-green-400 font-semibold mb-2">Transaction Submitted!</h3>
            <p className="text-gray-300 text-sm mb-3">
              Your transaction has been submitted to the blockchain.
            </p>
            <div className="bg-gray-900 rounded p-3 mb-3">
              <p className="text-xs text-gray-400 mb-1">Transaction ID:</p>
              <p className="text-xs font-mono break-all text-gray-300">{txId}</p>
            </div>
            <a
              href={`${explorerUrl}/txid/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              View on Explorer →
            </a>
            <p className="text-xs text-gray-500 mt-3">
              The transaction may take a few minutes to confirm.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {(error || txId) && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
          {loading && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
