'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { NumberInput } from '@/components/ui/number-input';
import { useCreateProposal } from '@/lib/hooks/use-governance';

const CATEGORY_OPTIONS = [
  { value: 'protocol', label: 'Protocol' },
  { value: 'treasury', label: 'Treasury' },
  { value: 'community', label: 'Community' },
  { value: 'technical', label: 'Technical' },
];

interface CreateProposalModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProposalModal({ open, onClose }: CreateProposalModalProps) {
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    category: 'community',
    durationDays: 7,
    quorum: 100,
  });
  const createMutation = useCreateProposal();

  function handleChange(field: keyof typeof form, value: string | number) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit() {
    await createMutation.mutateAsync(form);
    onClose();
  }

  const isValid = form.title.trim().length >= 10 && form.description.trim().length >= 50;

  return (
    <Modal open={open} onClose={onClose} title="Create Proposal" size="md">
      <div className="space-y-4">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="What do you want to change?"
          maxLength={120}
          hint={form.title.length < 10 ? `${10 - form.title.length} more characters needed` : undefined}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the proposal in detail. Include the motivation, implementation details, and expected impact."
          rows={5}
          maxLength={2000}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(v) => handleChange('category', v)}
          />
          <NumberInput
            label="Duration (days)"
            value={form.durationDays}
            onChange={(v) => handleChange('durationDays', v)}
            min={1}
            max={30}
            step={1}
            suffix="days"
          />
        </div>
        <NumberInput
          label="Quorum (min votes to pass)"
          value={form.quorum}
          onChange={(v) => handleChange('quorum', v)}
          min={10}
          max={10000}
          step={10}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValid}
            loading={createMutation.isPending}
          >
            Submit Proposal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
