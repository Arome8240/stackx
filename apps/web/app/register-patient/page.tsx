'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { stringAsciiCV, bufferCV } from '@stacks/transactions';
import { toast } from 'sonner';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import { contractCall } from '../../lib/contract-call';
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
  const { address, connect } = useWallet();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', dob: '', bloodType: 'O+', ipfsCid: '' });
  const [loading, setLoading] = useState(false);

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    try {
      const [nameHash, dobHash] = await Promise.all([
        sha256Hash(form.fullName),
        sha256Hash(form.dob),
      ]);
      await contractCall({
        contractId: Contracts.patientRegistry,
        functionName: 'register',
        functionArgs: [
          bufferCV(nameHash),
          bufferCV(dobHash),
          stringAsciiCV(form.bloodType),
          stringAsciiCV(form.ipfsCid || 'pending'),
        ],
        onSuccess: () => router.push('/dashboard'),
        onCancel: () => setLoading(false),
      });
    } catch (err) {
      toast.error('Transaction failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <ShieldCheck className="h-10 w-10 text-zinc-600" />
        <p className="text-zinc-400">Connect your wallet to register as a patient.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">Register as Patient</h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            Name and DOB are SHA-256 hashed client-side — only the hash is stored on-chain.
          </p>
        </div>
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
            label="IPFS CID (optional)"
            placeholder="Qm…"
            value={form.ipfsCid}
            onChange={set('ipfsCid')}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register on Stacks'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
