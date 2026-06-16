'use client';

import { Button } from '@/components/atoms/Button';

interface FilterButtonsProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterButtons({ options, value, onChange }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {options.map(opt => (
        <Button
          variant="secondary"
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors ${
            value === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}