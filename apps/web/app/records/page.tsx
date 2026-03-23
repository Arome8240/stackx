'use client';

import { useState } from 'react';
import { principalCV, stringAsciiCV } from '@stacks/transactions';
import { toast } from 'sonner';
import { FilePlus, ShieldCheck, ShieldOff, Loader2 } from 'lucide-react';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
import { contractCall } from '../../lib/contract-call';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

type RecordType = 'diagnosis' | 'prescription' | 'lab' | 'imaging';
const recordTypes: RecordType[] = ['diagnosis', 'prescription', 'lab', 'imaging'];
const typeVariant: Record<RecordType, 'info' | 'success' | 'warning' | 'default'> = {
  diagnosis: 'info',
  prescription: 'success',
  lab: 'warning',
  imaging: 'default',
};

export default function RecordsPage() {
  const { address, connect } = useWallet();
  const [addForm, setAddForm] = useState({
    patientAddress: '',
    ipfsCid: '',
    recordType: 'diagnosis' as RecordType,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [grantAddress, setGrantAddress] = useState('');
  const [revokeAddress, setRevokeAddress] = useState('');
  const [accessLoading, setAccessLoading] = useState<'grant' | 'revoke' | null>(null);

  const setAdd =
    (field: keyof typeof addForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAddForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleAddRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setAddLoading(true);
    try {
      await contractCall({
        contractId: Contracts.medicalRecords,
        functionName: 'add-record',
        functionArgs: [
          principalCV(addForm.patientAddress),
          stringAsciiCV(addForm.ipfsCid),
          stringAsciiCV(addForm.recordType),
        ],
        onSuccess: () => {
          setAddForm({ patientAddress: '', ipfsCid: '', recordType: 'diagnosis' });
          setAddLoading(false);
        },
        onCancel: () => setAddLoading(false),
      });
    } catch (err) {
      toast.error('Failed to add record', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      setAddLoading(false);
    }
  }

  async function handleAccess(action: 'grant-access' | 'revoke-access', grantee: string) {
    if (!address || !grantee) return;
    const type = action === 'grant-access' ? 'grant' : 'revoke';
    setAccessLoading(type);
    try {
      await contractCall({
        contractId: Contracts.medicalRecords,
        functionName: action,
        functionArgs: [principalCV(grantee)],
        onSuccess: () => {
          toast.success(type === 'grant' ? 'Access granted' : 'Access revoked');
          if (type === 'grant') setGrantAddress('');
          else setRevokeAddress('');
          setAccessLoading(null);
        },
        onCancel: () => setAccessLoading(null),
      });
    } catch (err) {
      toast.error('Failed', { description: err instanceof Error ? err.message : 'Unknown error' });
      setAccessLoading(null);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <FilePlus className="h-10 w-10 text-zinc-600" />
        <p className="text-zinc-400">Connect your wallet to manage medical records.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FilePlus className="h-6 w-6 text-brand" />
        <h1 className="text-2xl font-bold">Medical Records</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Doctor: add record */}
        <Card>
          <h2 className="mb-1 font-semibold text-white">Add Record</h2>
          <p className="mb-4 text-xs text-zinc-500">
            Doctor only — patient must have granted you access.
          </p>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <Input
              label="Patient's Stacks Address"
              placeholder="SP…"
              value={addForm.patientAddress}
              onChange={setAdd('patientAddress')}
              required
            />
            <Input
              label="IPFS CID (encrypted record)"
              placeholder="Qm…"
              value={addForm.ipfsCid}
              onChange={setAdd('ipfsCid')}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-400">Record Type</label>
              <select
                value={addForm.recordType}
                onChange={setAdd('recordType')}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                {recordTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={addLoading} className="w-full">
              {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Record'}
            </Button>
          </form>
        </Card>

        {/* Patient: access control */}
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="font-semibold text-white">Grant Access</h2>
            </div>
            <p className="mb-3 text-xs text-zinc-500">Allow a doctor to add records for you.</p>
            <div className="flex gap-2">
              <Input
                label="Doctor's Stacks Address"
                placeholder="SP…"
                value={grantAddress}
                onChange={(e) => setGrantAddress(e.target.value)}
              />
              <Button
                className="mt-5 shrink-0"
                disabled={accessLoading === 'grant'}
                onClick={() => handleAccess('grant-access', grantAddress)}
              >
                {accessLoading === 'grant' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Grant'}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2">
              <ShieldOff className="h-4 w-4 text-red-400" />
              <h2 className="font-semibold text-white">Revoke Access</h2>
            </div>
            <p className="mb-3 text-xs text-zinc-500">Remove a doctor's ability to add records.</p>
            <div className="flex gap-2">
              <Input
                label="Doctor's Stacks Address"
                placeholder="SP…"
                value={revokeAddress}
                onChange={(e) => setRevokeAddress(e.target.value)}
              />
              <Button
                variant="danger"
                className="mt-5 shrink-0"
                disabled={accessLoading === 'revoke'}
                onClick={() => handleAccess('revoke-access', revokeAddress)}
              >
                {accessLoading === 'revoke' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Revoke'
                )}
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold text-white">Record Types</h2>
            <div className="flex flex-wrap gap-2">
              {recordTypes.map((t) => (
                <Badge key={t} variant={typeVariant[t]}>
                  {t}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
