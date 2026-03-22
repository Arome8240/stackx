'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { principalCV } from '@stacks/transactions';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

// In a real app these would come from an on-chain registry or off-chain index
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
  const { address, network, connect } = useWallet();
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
      await openContractCall({
        network,
        contractAddress: Contracts.medicalRecords.split('.')[0],
        contractName: Contracts.medicalRecords.split('.')[1],
        functionName: action,
        functionArgs: [principalCV(doctorAddress)],
        onFinish: () => {
          setGranted((prev) => {
            const next = new Set(prev);
            action === 'grant-access' ? next.add(doctorAddress) : next.delete(doctorAddress);
            return next;
          });
          setLoading(null);
        },
        onCancel: () => setLoading(null),
      });
    } catch {
      setLoading(null);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-zinc-400">Connect your wallet to manage doctor access.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <div className="w-64">
          <Input
            label="Search"
            placeholder="Name or specialty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        Grant a doctor access to add medical records on your behalf. You can revoke at any time.
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
                  {hasAccess ? 'Access granted' : 'No access'}
                </Badge>
              </div>
              <p className="truncate text-xs text-zinc-600">{doc.address}</p>
              <Button
                size="sm"
                variant={hasAccess ? 'danger' : 'primary'}
                loading={loading === doc.address}
                onClick={() =>
                  toggleAccess(doc.address, hasAccess ? 'revoke-access' : 'grant-access')
                }
              >
                {hasAccess ? 'Revoke Access' : 'Grant Access'}
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
