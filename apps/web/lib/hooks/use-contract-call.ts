'use client';

import { useState } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import { verifyHospital, updateHospitalStatus, revokeHospital } from '../sdk/contract-calls';

export function useContractCall() {
  const config = useStacksSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const approveHospital = async (hospitalId: number) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await verifyHospital(config, hospitalId, {
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
          setError('Transaction cancelled by user');
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve hospital');
      setLoading(false);
    }
  };

  const suspendHospital = async (hospitalId: number) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await updateHospitalStatus(config, hospitalId, 'suspended', {
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
          setError('Transaction cancelled by user');
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend hospital');
      setLoading(false);
    }
  };

  const reactivateHospital = async (hospitalId: number) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await updateHospitalStatus(config, hospitalId, 'active', {
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
          setError('Transaction cancelled by user');
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate hospital');
      setLoading(false);
    }
  };

  const rejectHospital = async (hospitalId: number) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await revokeHospital(config, hospitalId, {
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
          setError('Transaction cancelled by user');
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject hospital');
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setTxId(null);
  };

  return {
    approveHospital,
    suspendHospital,
    reactivateHospital,
    rejectHospital,
    loading,
    error,
    txId,
    reset,
  };
}
