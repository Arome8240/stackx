'use client';

import { useState, useEffect } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import { getHospital } from '../sdk/hospital-registry';
import type { Hospital } from '../types/sdk';

export function useHospitals(hospitalIds: number[]) {
  const config = useStacksSDK();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHospitals() {
      if (!config.contractAddress || hospitalIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const hospitalPromises = hospitalIds.map((id) => getHospital(config, id));
        const results = await Promise.all(hospitalPromises);
        
        const validHospitals = results.filter((h): h is Hospital => h !== null);
        setHospitals(validHospitals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, [config, hospitalIds.join(',')]);

  return { hospitals, loading, error };
}

export function useHospital(hospitalId: number | null) {
  const config = useStacksSDK();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHospital() {
      if (!config.contractAddress || hospitalId === null) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getHospital(config, hospitalId);
        setHospital(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hospital');
        console.error('Error fetching hospital:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHospital();
  }, [config, hospitalId]);

  return { hospital, loading, error };
}
