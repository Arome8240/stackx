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
        className={`peer w-full rounded-md border bg-background px-4 pb-2 pt-6 text-sm text-foreground outline-none transition-colors
            placeholder:text-muted-foreground
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
            ${error ? 'border-destructive' : 'border-input'}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-foreground
            peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
