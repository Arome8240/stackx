import { useState, useEffect } from 'react';
import { useStacksSDK } from './use-stacks-sdk';
import { fetchAppointment } from '../sdk/appointments';
import type { Appointment } from '../sdk/appointments';

export function useAppointments() {
  const { network, contractAddress } = useStacksSDK();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!network || !contractAddress) {
      setError('SDK not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Note: Similar to patients, appointment data requires event indexing
      // In production, you would:
      // 1. Index appointment creation events
      // 2. Store appointment IDs in a database
      // 3. Query the list and fetch details
      
      setAppointments([]);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [network, contractAddress]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
}

export function useAppointment(appointmentId: number) {
  const { network, contractAddress } = useStacksSDK();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointmentData = async () => {
    if (!network || !contractAddress || appointmentId === undefined) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const appointmentData = await fetchAppointment(
        'testnet',
        contractAddress,
        'appointments',
        appointmentId
      );

      setAppointment(appointmentData);
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
  }, [network, contractAddress, appointmentId]);

  return {
    appointment,
    loading,
    error,
    refetch: fetchAppointmentData,
  };
}
