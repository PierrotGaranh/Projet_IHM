import { Button } from "@/components/atoms/Button";

interface ReservationFilterButtonsProps {
  filter: 'all' | 'active' | 'completed' | 'cancelled';
  onFilterChange: (filter: 'all' | 'active' | 'completed' | 'cancelled') => void;
}

export function ReservationFilterButtons({ filter, onFilterChange }: ReservationFilterButtonsProps) {
  const options: { value: 'all' | 'active' | 'completed' | 'cancelled'; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'active', label: 'Actives' },
    { value: 'completed', label: 'Complétées' },
    { value: 'cancelled', label: 'Annulées' },
  ];
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {options.map(opt => (
        <Button
          variant="secondary"
          key={opt.value}
          onClick={() => onFilterChange(opt.value)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}