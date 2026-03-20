import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, ...props }, ref) => {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        id={inputId}
        placeholder=" "
        className={`peer w-full rounded-md border bg-transparent px-4 pb-2 pt-6 text-sm text-white outline-none transition
            focus:ring-2
            ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-700 focus:border-brand focus:ring-brand/40'
            }`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-4 top-4 text-sm text-zinc-500 transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand
            peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
