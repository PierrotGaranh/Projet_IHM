import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      <input ref={ref} className={`input-base w-full ${error ? 'border-destructive' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';