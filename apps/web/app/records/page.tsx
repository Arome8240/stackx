'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { principalCV, stringAsciiCV } from '@stacks/transactions';
import { useWallet } from '../../components/providers/wallet-provider';
import { Contracts } from '../../lib/contracts';
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
  const { address, network, connect } = useWallet();

  // Add record (doctor flow)
  const [addForm, setAddForm] = useState({
    patientAddress: '',
    ipfsCid: '',
    recordType: 'diagnosis' as RecordType,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addTx, setAddTx] = useState('');
  const [addError, setAddError] = useState('');

  // Access control (patient flow)
  const [grantAddress, setGrantAddress] = useState('');
  const [revokeAddress, setRevokeAddress] = useState('');
  const [accessLoading, setAccessLoading] = useState<'grant' | 'revoke' | null>(null);

  const setAdd =
    (field: keyof typeof addForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAddForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleAddRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setAddError('');
    setAddLoading(true);
    try {
      await openContractCall({
        network,
        contractAddress: Contracts.medicalRecords.split('.')[0],
        contractName: Contracts.medicalRecords.split('.')[1],
        functionName: 'add-record',
        functionArgs: [
          principalCV(addForm.patientAddress),
          stringAsciiCV(addForm.ipfsCid),
          stringAsciiCV(addForm.recordType),
        ],
        onFinish: (data) => {
          setAddTx(data.txId);
          setAddLoading(false);
        },
        onCancel: () => setAddLoading(false),
      });
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed');
      setAddLoading(false);
    }
  }

  async function handleAccess(action: 'grant-access' | 'revoke-access', grantee: string) {
    if (!address) return;
    setAccessLoading(action === 'grant-access' ? 'grant' : 'revoke');
    try {
      await openContractCall({
        network,
        contractAddress: Contracts.medicalRecords.split('.')[0],
        contractName: Contracts.medicalRecords.split('.')[1],
        functionName: action,
        functionArgs: [principalCV(grantee)],
        onFinish: () => setAccessLoading(null),
        onCancel: () => setAccessLoading(null),
      });
    } catch {
      setAccessLoading(null);
    }
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-zinc-400">Connect your wallet to manage medical records.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Medical Records</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Doctor: add record */}
        <Card>
          <h2 className="mb-1 font-semibold text-white">Add Record</h2>
          <p className="mb-4 text-xs text-zinc-500">
            Doctor only — you must have access granted by the patient.
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
            {addError && <p className="text-sm text-red-500">{addError}</p>}
            {addTx && <p className="text-sm text-emerald-400">Added! Tx: {addTx.slice(0, 16)}…</p>}
            <Button type="submit" loading={addLoading} className="w-full">
              Submit Record
            </Button>
          </form>
        </Card>

        {/* Patient: access control */}
        <div className="space-y-4">
          <Card>
            <h2 className="mb-1 font-semibold text-white">Grant Access</h2>
            <p className="mb-4 text-xs text-zinc-500">Allow a doctor to add records for you.</p>
            <div className="flex gap-2">
              <Input
                label="Doctor's Stacks Address"
                placeholder="SP…"
                value={grantAddress}
                onChange={(e) => setGrantAddress(e.target.value)}
              />
              <Button
                className="mt-5 shrink-0"
                loading={accessLoading === 'grant'}
                onClick={() => handleAccess('grant-access', grantAddress)}
              >
                Grant
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="mb-1 font-semibold text-white">Revoke Access</h2>
            <p className="mb-4 text-xs text-zinc-500">Remove a doctor's ability to add records.</p>
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
                loading={accessLoading === 'revoke'}
                onClick={() => handleAccess('revoke-access', revokeAddress)}
              >
                Revoke
              </Button>
            </div>
          </Card>

          {/* Record type legend */}
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
