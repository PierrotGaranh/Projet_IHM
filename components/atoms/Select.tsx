import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ options, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      <select ref={ref} className={`input-base w-full ${error ? 'border-destructive' : ''} ${className}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';