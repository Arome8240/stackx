'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../components/providers/wallet-provider';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';
import { isRegistered, getPatientAppointments, getDoctorAppointments } from '../../lib/contracts';

type Tab = 'patient' | 'doctor';

export default function DashboardPage() {
  const { address, network, connect } = useWallet();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('patient');
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [apptIds, setApptIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    Promise.all([
      isRegistered(address, network),
      tab === 'patient'
        ? getPatientAppointments(address, network)
        : getDoctorAppointments(address, network),
    ])
      .then(([reg, appts]) => {
        setRegistered(reg as boolean);
        const ids = (appts as { ids?: number[] })?.ids ?? [];
        setApptIds(ids);
      })
      .catch(() => {
        setRegistered(false);
        setApptIds([]);
      })
      .finally(() => setLoading(false));
  }, [address, network, tab]);

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-zinc-400">Connect your Stacks wallet to access your dashboard.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex rounded-lg border border-zinc-800 p-1 gap-1">
          {(['patient', 'doctor'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition
                ${tab === t ? 'bg-brand text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Registration status */}
          <Card>
            <p className="text-xs text-zinc-500 mb-2">Registry Status</p>
            {tab === 'patient' ? (
              registered ? (
                <div className="space-y-3">
                  <Badge variant="success">Registered</Badge>
                  <p className="text-xs text-zinc-400">Your identity is on-chain.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Badge variant="warning">Not Registered</Badge>
                  <Button size="sm" onClick={() => router.push('/register-patient')}>
                    Register Now
                  </Button>
                </div>
              )
            ) : (
              <Badge variant="info">Doctor View</Badge>
            )}
          </Card>

          {/* Appointments */}
          <Card>
            <p className="text-xs text-zinc-500 mb-2">Appointments</p>
            <p className="text-3xl font-bold text-white">{apptIds.length}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {tab === 'patient' ? 'booked' : 'received'}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => router.push('/appointments')}
            >
              View all
            </Button>
          </Card>

          {/* Records */}
          <Card>
            <p className="text-xs text-zinc-500 mb-2">Medical Records</p>
            <p className="text-xs text-zinc-400">
              {tab === 'patient'
                ? 'View and manage your encrypted records.'
                : 'Add records for your patients.'}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => router.push('/records')}
            >
              Open Records
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
