type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const styles: Record<BadgeVariant, string> = {
  default: 'bg-zinc-800 text-zinc-300',
  success: 'bg-emerald-900/50 text-emerald-400',
  warning: 'bg-amber-900/50 text-amber-400',
  danger: 'bg-red-900/50 text-red-400',
  info: 'bg-sky-900/50 text-sky-400',
};

export default function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
