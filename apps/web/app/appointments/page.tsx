'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { principalCV, uintCV, stringAsciiCV } from '@stacks/transactions';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

const statusVariant: Record<AppointmentStatus, 'warning' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'default',
};

export default function AppointmentsPage() {
  const { address, network, connect } = useWallet();
  const [form, setForm] = useState({ doctorAddress: '', slot: '', notesCid: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txId, setTxId] = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function bookAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setError('');
    setLoading(true);
    try {
      const slotTimestamp = Math.floor(new Date(form.slot).getTime() / 1000);
      await openContractCall({
        network,
        contractAddress: Contracts.appointments.split('.')[0],
        contractName: Contracts.appointments.split('.')[1],
        functionName: 'book',
        functionArgs: [
          principalCV(form.doctorAddress),
          uintCV(slotTimestamp),
          stringAsciiCV(form.notesCid || 'none'),
        ],
        onFinish: (data) => {
          setTxId(data.txId);
          setForm({ doctorAddress: '', slot: '', notesCid: '' });
          setLoading(false);
        },
        onCancel: () => setLoading(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-zinc-400">Connect your wallet to manage appointments.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Appointments</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Book form */}
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
            {error && <p className="text-sm text-red-500">{error}</p>}
            {txId && <p className="text-sm text-emerald-400">Booked! Tx: {txId.slice(0, 16)}…</p>}
            <Button type="submit" loading={loading} className="w-full">
              Book on Stacks
            </Button>
          </form>
        </Card>

        {/* Status legend */}
        <Card>
          <h2 className="mb-4 font-semibold text-white">Appointment Statuses</h2>
          <div className="space-y-3">
            {(['pending', 'confirmed', 'cancelled', 'completed'] as AppointmentStatus[]).map(
              (s) => (
                <div key={s} className="flex items-center gap-3">
                  <Badge variant={statusVariant[s]}>{s}</Badge>
                  <span className="text-xs text-zinc-400 capitalize">
                    {s === 'pending' && 'Awaiting doctor confirmation'}
                    {s === 'confirmed' && 'Doctor confirmed the slot'}
                    {s === 'cancelled' && 'Cancelled by patient or doctor'}
                    {s === 'completed' && 'Visit completed'}
                  </span>
                </div>
              ),
            )}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Doctors can confirm or complete appointments from their dashboard view.
          </p>
        </Card>
      </div>
    </div>
  );
}
