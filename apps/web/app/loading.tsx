import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="text-2xl font-black text-primary">StackX</div>
        <Spinner size="md" />
      </div>
    </div>
  );
}
