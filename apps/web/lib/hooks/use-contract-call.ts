'use client';

import { useState } from 'react';
import { useStacksSDK, type StaxialConfig } from './use-stacks-sdk';
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV, type ClarityValue } from '@stacks/transactions';
import type { FinishedTxData, Canceled } from '@stacks/connect';

/**
 * `staxial-sdk` (linked locally via `apps/web/package.json`) only exposes
 * read-only helpers (`getHospital`, `isHospitalVerified`, etc.) — it has no
 * write/transaction functions. The hospital-admin write calls below
 * (`verify-hospital`, `update-hospital-status`, `revoke-hospital`) have no
 * equivalent there, so they're implemented locally as thin wrappers around
 * `@stacks/connect`'s `openContractCall` + `@stacks/transactions` Clarity
 * value builders. These are typed stubs pending real contract ABI wiring.
 */
type TxCallback = { onFinish?: (data: FinishedTxData) => void; onCancel?: Canceled };

function callHospitalContract(
  config: StaxialConfig,
  functionName: string,
  functionArgs: ClarityValue[],
  cb?: TxCallback,
) {
  return openContractCall({
    network: config.network,
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName,
    functionArgs,
    onFinish: cb?.onFinish,
    onCancel: cb?.onCancel,
  });
}

function verifyHospital(config: StaxialConfig, hospitalId: number, cb?: TxCallback) {
  return callHospitalContract(config, 'verify-hospital', [uintCV(hospitalId)], cb);
}

function updateHospitalStatus(
  config: StaxialConfig,
  hospitalId: number,
  status: 'active' | 'suspended',
  cb?: TxCallback,
) {
  return callHospitalContract(
    config,
    'update-hospital-status',
    [uintCV(hospitalId), stringAsciiCV(status)],
    cb,
  );
}

function revokeHospital(config: StaxialConfig, hospitalId: number, cb?: TxCallback) {
  return callHospitalContract(config, 'revoke-hospital', [uintCV(hospitalId)], cb);
}

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
