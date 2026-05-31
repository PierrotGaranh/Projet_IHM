import { ReactNode } from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label className={`label-base ${className}`} {...props}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}