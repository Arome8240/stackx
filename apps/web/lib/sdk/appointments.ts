import { getAppointment } from 'staxial-sdk';
import type { StacksNetworkName } from '@stacks/network';

export interface Appointment {
  id: number;
  patient: string;
  hospital: string;
  doctor: string;
  appointmentDate: number;
  fee: number;
  status: string;
  notes: string;
  createdAt: number;
}

export async function fetchAppointment(
  network: StacksNetworkName,
  contractAddress: string,
  contractName: string,
  appointmentId: number
): Promise<Appointment | null> {
  try {
    const appointment = await getAppointment(
      { network, contractAddress, contractName },
      appointmentId
    );
    return appointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
}

export function getAppointmentStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-900/50 text-yellow-400';
    case 'confirmed':
      return 'bg-blue-900/50 text-blue-400';
    case 'completed':
      return 'bg-green-900/50 text-green-400';
    case 'cancelled':
      return 'bg-red-900/50 text-red-400';
    default:
      return 'bg-gray-700 text-gray-400';
  }
}
