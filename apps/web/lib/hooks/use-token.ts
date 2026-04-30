import { useState, useEffect } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import {
  fetchTokenStats,
  fetchTokenHolders,
  fetchTokenTransactions,
  mintTokens,
  burnTokens,
} from '../sdk/token';
import type { TokenStats, TokenHolder, TokenTransaction } from '../sdk/token';

export function useTokenStats() {
  const { network, contractAddress } = useStacksSDK();
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!network || !contractAddress) {
      setError('SDK not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tokenStats = await fetchTokenStats(network, contractAddress, 'health-token');
      setStats(tokenStats);
    } catch (err) {
      console.error('Error fetching token stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [network, contractAddress]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useTokenHolders() {
  const { network, contractAddress } = useStacksSDK();
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHolders = async () => {
    if (!network || !contractAddress) {
      setError('SDK not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tokenHolders = await fetchTokenHolders(network, contractAddress, 'health-token');
      setHolders(tokenHolders);
    } catch (err) {
      console.error('Error fetching token holders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token holders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolders();
  }, [network, contractAddress]);

  return {
    holders,
    loading,
    error,
    refetch: fetchHolders,
  };
}

export function useTokenTransactions() {
  const { network, contractAddress } = useStacksSDK();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!network || !contractAddress) {
      setError('SDK not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tokenTxs = await fetchTokenTransactions(network, contractAddress, 'health-token');
      setTransactions(tokenTxs);
    } catch (err) {
      console.error('Error fetching token transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [network, contractAddress]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
}

export function useTokenOperations() {
  const { network, contractAddress } = useStacksSDK();
  const [loading, setLoading] = useState(false);

  const mint = async (amount: number, recipient: string) => {
    if (!network || !contractAddress) {
      return { success: false, error: 'SDK not configured' };
    }

    setLoading(true);
    try {
      const result = await mintTokens(network, contractAddress, 'health-token', amount, recipient);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const burn = async (amount: number) => {
    if (!network || !contractAddress) {
      return { success: false, error: 'SDK not configured' };
    }

    setLoading(true);
    try {
      const result = await burnTokens(network, contractAddress, 'health-token', amount);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    mint,
    burn,
    loading,
  };
}
