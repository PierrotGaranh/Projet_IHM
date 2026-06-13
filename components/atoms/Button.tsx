import { ReactNode } from 'react';
import { LoadingDots } from './LoadingDots';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function Button({ variant = 'ghost', isLoading = false, loadingText, children, className = '', disabled, ...props }: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };
  const baseClass = 'rounded-lg transition-colors disabled:opacity-50';
  const isDisabled = disabled || isLoading;
  return (
    <button className={`${baseClass} ${variantClasses[variant]} ${className} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={isDisabled} {...props}>
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span>{loadingText || children}</span>
          <LoadingDots />
        </span>
      ) : children}
    </button>
  );
}