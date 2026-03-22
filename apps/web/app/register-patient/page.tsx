'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { openContractCall } from '@stacks/connect';
import { stringAsciiCV, bufferCV } from '@stacks/transactions';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';

async function sha256Hash(text: string): Promise<Uint8Array> {
  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return new Uint8Array(hashBuffer);
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterPatientPage() {
  const { address, network, connect } = useWallet();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', dob: '', bloodType: 'O+', ipfsCid: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setError('');
    setLoading(true);
    try {
      const [nameHash, dobHash] = await Promise.all([
        sha256Hash(form.fullName),
        sha256Hash(form.dob),
      ]);

      await openContractCall({
        network,
        contractAddress: Contracts.patientRegistry.split('.')[0],
        contractName: Contracts.patientRegistry.split('.')[1],
        functionName: 'register',
        functionArgs: [
          bufferCV(nameHash),
          bufferCV(dobHash),
          stringAsciiCV(form.bloodType),
          stringAsciiCV(form.ipfsCid || 'pending'),
        ],
        onFinish: () => router.push('/dashboard'),
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
        <p className="text-zinc-400">Connect your wallet to register as a patient.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Register as Patient</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Your name and date of birth are hashed before being stored on-chain. Only the hash is
          visible publicly.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={set('fullName')}
            required
          />
          <Input
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={set('dob')}
            required
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-400">Blood Type</label>
            <select
              value={form.bloodType}
              onChange={set('bloodType')}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="IPFS CID (optional — encrypted records pointer)"
            placeholder="Qm…"
            value={form.ipfsCid}
            onChange={set('ipfsCid')}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Register on Stacks
          </Button>
        </form>
      </Card>
    </div>
  );
}
