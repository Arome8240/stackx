'use client';

import { useState, useEffect } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import { getHospital } from '../sdk/hospital-registry';

interface DashboardStats {
  totalHospitals: number;
  pendingHospitals: number;
  activeHospitals: number;
  suspendedHospitals: number;
  totalPatients: number;
  totalAppointments: number;
  totalPrescriptions: number;
}

export function useDashboardStats() {
  const config = useStacksSDK();
  const [stats, setStats] = useState<DashboardStats>({
    totalHospitals: 0,
    pendingHospitals: 0,
    activeHospitals: 0,
    suspendedHospitals: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!config.contractAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch hospitals (IDs 1-20 for demo)
        const hospitalIds = Array.from({ length: 20 }, (_, i) => i + 1);
        const hospitalPromises = hospitalIds.map((id) => getHospital(config, id));
        const hospitals = (await Promise.all(hospitalPromises)).filter((h) => h !== null);

        const pending = hospitals.filter((h) => h.status === 'pending').length;
        const active = hospitals.filter((h) => h.status === 'active').length;
        const suspended = hospitals.filter((h) => h.status === 'suspended').length;

        setStats({
          totalHospitals: hospitals.length,
          pendingHospitals: pending,
          activeHospitals: active,
          suspendedHospitals: suspended,
          // TODO: Fetch real patient, appointment, and prescription counts
          totalPatients: 0,
          totalAppointments: 0,
          totalPrescriptions: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [config]);

  return { stats, loading, error };
}
