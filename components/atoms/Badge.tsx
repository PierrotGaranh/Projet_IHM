import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-foreground',
    success: 'bg-secondary/10 text-secondary',
    destructive: 'bg-destructive/10 text-destructive',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
}