import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`card-base ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  );
}