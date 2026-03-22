import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

const stack = [
  { name: 'Next.js 15', role: 'Web framework', badge: 'frontend' as const },
  { name: 'Stacks.js', role: 'Wallet + contract calls', badge: 'blockchain' as const },
  { name: 'Clarity', role: 'Smart contracts', badge: 'blockchain' as const },
  { name: 'Tailwind CSS', role: 'Styling', badge: 'frontend' as const },
  { name: 'IPFS', role: 'Encrypted off-chain storage', badge: 'storage' as const },
];

const badgeMap = {
  frontend: 'info',
  blockchain: 'success',
  storage: 'warning',
} as const;

const contracts = [
  {
    name: 'patient-registry',
    desc: 'Stores hashed patient identity (name, DOB) and an IPFS pointer to encrypted records. Only the patient can register or update their own entry.',
  },
  {
    name: 'medical-records',
    desc: 'Doctors write encrypted record CIDs on behalf of patients. Patients grant or revoke doctor access at any time.',
  },
  {
    name: 'appointments',
    desc: 'Patients book time slots with doctors. Doctors confirm, complete, or cancel. Full lifecycle tracked on-chain.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold">About HealthChain</h1>
        <p className="text-zinc-400">
          HealthChain is a decentralised health and hospital management dApp built on the{' '}
          <span className="text-white">Stacks blockchain</span>. It gives patients full ownership of
          their medical data while enabling doctors and hospitals to interact with that data through
          on-chain access control — no central database, no data brokers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Smart Contracts</h2>
        <div className="space-y-3">
          {contracts.map((c) => (
            <Card key={c.name}>
              <div className="flex items-start gap-3">
                <code className="mt-0.5 shrink-0 rounded bg-zinc-800 px-2 py-0.5 text-xs text-brand">
                  {c.name}.clar
                </code>
                <p className="text-sm text-zinc-400">{c.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Tech Stack</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {stack.map((s) => (
            <Card key={s.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-zinc-500">{s.role}</p>
              </div>
              <Badge variant={badgeMap[s.badge]}>{s.badge}</Badge>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Privacy Model</h2>
        <p className="text-sm text-zinc-400">
          Sensitive data (names, dates of birth, medical records) never touches the blockchain
          directly. Names and DOBs are SHA-256 hashed client-side before being submitted. Medical
          record content is encrypted and stored on IPFS — only the CID pointer lives on-chain.
          Access to that pointer is gated by the patient&apos;s on-chain grant.
        </p>
      </section>
    </div>
  );
}
