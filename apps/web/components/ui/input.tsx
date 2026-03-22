import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, ...props }, ref) => {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-xs font-medium text-zinc-400">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition
          focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-zinc-700 focus:border-brand focus:ring-brand/30'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
