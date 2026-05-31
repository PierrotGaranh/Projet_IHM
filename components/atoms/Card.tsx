import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`card-base p-6 ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  );
}