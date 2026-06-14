'use client';

import { ReactNode } from 'react';

interface HorizontalScrollProps {
  children: ReactNode;
  gap?: number;
  className?: string;
}

export function HorizontalScroll({ children, gap = 4, className = '' }: HorizontalScrollProps) {
  return (
    <div className={`overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 ${className}`}>
      <div className="flex pb-4 items-stretch" style={{ gap: `${gap * 0.25}rem` }}>
        {children}
      </div>
    </div>
  );
}