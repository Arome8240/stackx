'use client';

import { useState } from 'react';
import { principalCV } from '@stacks/transactions';
import { toast } from 'sonner';
import { Stethoscope, ShieldCheck, ShieldOff, Search, Loader2 } from 'lucide-react';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import { contractCall } from '../../lib/contract-call';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

const SAMPLE_DOCTORS = [
  {
    address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ',
    name: 'Dr. Amara Osei',
    specialty: 'Cardiology',
  },
  {
    address: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7',
    name: 'Dr. Lena Fischer',
    specialty: 'Neurology',
  },
  {
    address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    name: 'Dr. James Okafor',
    specialty: 'General Practice',
  },
];

export default function DoctorsPage() {
  const { address, connect } = useWallet();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [granted, setGranted] = useState<Set<string>>(new Set());

  const filtered = SAMPLE_DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  async function toggleAccess(doctorAddress: string, action: 'grant-access' | 'revoke-access') {
    if (!address) return;
    setLoading(doctorAddress);
    try {
      await contractCall({
        contractId: Contracts.medicalRecords,
        functionName: action,
        functionArgs: [principalCV(doctorAddress)],
        onSuccess: () => {
          setGranted((prev) => {
            const next = new Set(prev);
            action === 'grant-access' ? next.add(doctorAddress) : next.delete(doctorAddress);
            return next;
          });
          toast.success(action === 'grant-access' ? 'Access granted' : 'Access revoked');
          setLoading(null);
        },
        onCancel: () => setLoading(null),
      });
    } catch (err) {
      toast.error('Failed', { description: err instanceof Error ? err.message : 'Unknown error' });
      setLoading(null);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Stethoscope className="h-10 w-10 text-zinc-600" />
        <p className="text-zinc-400">Connect your wallet to manage doctor access.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-bold">Doctors</h1>
        </div>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            placeholder="Name or specialty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-8 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        Grant a doctor access to add medical records on your behalf. Revoke at any time.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => {
          const hasAccess = granted.has(doc.address);
          return (
            <Card key={doc.address} className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{doc.name}</p>
                  <p className="text-xs text-zinc-500">{doc.specialty}</p>
                </div>
                <Badge variant={hasAccess ? 'success' : 'default'}>
                  <span className="flex items-center gap-1">
                    {hasAccess ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <ShieldOff className="h-3 w-3" />
                    )}
                    {hasAccess ? 'Granted' : 'No access'}
                  </span>
                </Badge>
              </div>
              <p className="truncate font-mono text-xs text-zinc-600">{doc.address}</p>
              <Button
                size="sm"
                variant={hasAccess ? 'danger' : 'primary'}
                disabled={loading === doc.address}
                onClick={() =>
                  toggleAccess(doc.address, hasAccess ? 'revoke-access' : 'grant-access')
                }
              >
                {loading === doc.address ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : hasAccess ? (
                  'Revoke Access'
                ) : (
                  'Grant Access'
                )}
              </Button>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-zinc-500">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
