import { useState, useEffect } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import { fetchPrescription } from '../sdk/prescriptions-sdk';
import type { Prescription } from '../sdk/prescriptions-sdk';

export function usePrescriptions() {
  const { network, contractAddress } = useStacksSDK();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    if (!network || !contractAddress) {
      setError('SDK not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Note: Prescription data requires event indexing
      // In production, you would:
      // 1. Index prescription issuance events
      // 2. Store prescription IDs in a database
      // 3. Query the list and fetch details
      
      setPrescriptions([]);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [network, contractAddress]);

  return {
    prescriptions,
    loading,
    error,
    refetch: fetchPrescriptions,
  };
}

export function usePrescription(prescriptionId: number) {
  const { network, contractAddress } = useStacksSDK();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptionData = async () => {
    if (!network || !contractAddress || prescriptionId === undefined) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const prescriptionData = await fetchPrescription(
        network,
        contractAddress,
        'prescriptions',
        prescriptionId
      );

      setPrescription(prescriptionData);
    } catch (err) {
      console.error('Error fetching prescription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prescription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptionData();
  }, [network, contractAddress, prescriptionId]);

  return {
    prescription,
    loading,
    error,
    refetch: fetchPrescriptionData,
  };
}
