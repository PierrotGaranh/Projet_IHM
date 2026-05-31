import { ReactNode } from 'react';
import { LoadingDots } from './LoadingDots';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function Button({ variant = 'ghost', isLoading = false, loadingText, children, className = '', disabled, ...props }: ButtonProps) {
  const baseClass = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost';
  const isDisabled = disabled || isLoading;
  return (
    <button className={`${baseClass} ${className} cursor-${isDisabled ? 'not-allowed' : 'pointer'}`} disabled={isDisabled} {...props}>
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span>{loadingText || children}</span>
          <LoadingDots />
        </span>
      ) : children}
    </button>
  );
}