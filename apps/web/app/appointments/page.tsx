'use client';

import { useState } from 'react';
import { principalCV, uintCV, stringAsciiCV } from '@stacks/transactions';
import { toast } from 'sonner';
import { CalendarPlus, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import { contractCall } from '../../lib/contract-call';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

const statusMeta: Record<
  AppointmentStatus,
  { variant: 'warning' | 'success' | 'danger' | 'default'; icon: React.ReactNode; label: string }
> = {
  pending: {
    variant: 'warning',
    icon: <Clock className="h-3.5 w-3.5" />,
    label: 'Awaiting doctor confirmation',
  },
  confirmed: {
    variant: 'success',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: 'Doctor confirmed the slot',
  },
  cancelled: {
    variant: 'danger',
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: 'Cancelled by patient or doctor',
  },
  completed: {
    variant: 'default',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: 'Visit completed',
  },
};

export default function AppointmentsPage() {
  const { address, network, connect } = useWallet();
  const [form, setForm] = useState({ doctorAddress: '', slot: '', notesCid: '' });
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function bookAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    try {
      const slotTimestamp = Math.floor(new Date(form.slot).getTime() / 1000);
      await contractCall({
        network,
        contractId: Contracts.appointments,
        functionName: 'book',
        functionArgs: [
          principalCV(form.doctorAddress),
          uintCV(slotTimestamp),
          stringAsciiCV(form.notesCid || 'none'),
        ],
        onSuccess: () => {
          setForm({ doctorAddress: '', slot: '', notesCid: '' });
          setLoading(false);
        },
        onCancel: () => setLoading(false),
      });
    } catch (err) {
      toast.error('Booking failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <CalendarPlus className="h-10 w-10 text-zinc-600" />
        <p className="text-zinc-400">Connect your wallet to manage appointments.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <CalendarPlus className="h-6 w-6 text-brand" />
        <h1 className="text-2xl font-bold">Appointments</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-white">Book an Appointment</h2>
          <form onSubmit={bookAppointment} className="space-y-4">
            <Input
              label="Doctor's Stacks Address"
              placeholder="SP…"
              value={form.doctorAddress}
              onChange={set('doctorAddress')}
              required
            />
            <Input
              label="Date & Time"
              type="datetime-local"
              value={form.slot}
              onChange={set('slot')}
              required
            />
            <Input
              label="Notes CID (optional)"
              placeholder="IPFS CID of encrypted notes"
              value={form.notesCid}
              onChange={set('notesCid')}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Book on Stacks'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-white">Appointment Statuses</h2>
          <div className="space-y-3">
            {(
              Object.entries(statusMeta) as [
                AppointmentStatus,
                (typeof statusMeta)[AppointmentStatus],
              ][]
            ).map(([status, meta]) => (
              <div key={status} className="flex items-center gap-3">
                <Badge variant={meta.variant}>
                  <span className="flex items-center gap-1">
                    {meta.icon}
                    {status}
                  </span>
                </Badge>
                <span className="text-xs text-zinc-400">{meta.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Doctors confirm or complete appointments from their dashboard view.
          </p>
        </Card>
      </div>
    </div>
  );
}
