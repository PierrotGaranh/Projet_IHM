import { ReactNode } from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  showRequired?: boolean;
}

export function Label({ children, showRequired, className = '', ...props }: LabelProps) {
  return (
    <label className={`label-base ${className}`} {...props}>
      {children}
      {showRequired && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}