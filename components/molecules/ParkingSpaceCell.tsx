import { ParkingSpace } from '@/lib/types';
import { Minimize2, CarFront, Crown, Accessibility, Plug, Camera, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface ParkingSpaceCellProps {
  space: ParkingSpace;
  isSelected: boolean;
  isMyReservation: boolean;
  onSelect: () => void;
  disabled?: boolean;
  isMobile?: boolean;
}

const featureIcons: Record<string, React.ElementType> = {
  handicap: Accessibility,
  chargeur: Plug,
  surveillée: Camera,
  sécurisée: ShieldCheck,
};

const typeIcon = {
  compact: Minimize2,
  standard: CarFront,
  premium: Crown,
};

export function ParkingSpaceCell({ space, isSelected, isMyReservation, onSelect, disabled, isMobile = false }: ParkingSpaceCellProps) {
  const TypeIcon = typeIcon[space.type];
  
  const getStatusClasses = () => {
    if (space.status === 'available') return 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200';
    if (space.status === 'occupied') return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 opacity-70 cursor-not-allowed';
    if (space.status === 'maintenance') return 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 opacity-70 cursor-not-allowed';
    return '';
  };

  const borderClass = space.type === 'compact' ? 'border-blue-400' : space.type === 'standard' ? 'border-gray-400' : 'border-yellow-500';
  
  if (isMobile) {
    return (
      <Button
        onClick={onSelect}
        disabled={disabled}
        className={`relative w-full aspect-square rounded-lg transition-all font-bold text-base ${getStatusClasses()} ${isSelected ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-background' : ''} ${isMyReservation ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''} disabled:opacity-70 border-b-2 ${borderClass}`}
        title={`Place ${space.number} - ${space.type}`}
      >
        <span className="block w-full text-center">{space.number}</span>
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
          {space.features.slice(0, 2).map((feature) => {
            const Icon = featureIcons[feature];
            return Icon ? <Icon key={feature} className="w-3 h-3 text-current opacity-80" /> : null;
          })}
          {space.features.length > 2 && <span className="text-[10px]">+{space.features.length - 2}</span>}
        </div>
      </Button>
    );
  }

  return (
    <div className="relative z-0 hover:z-20">
      <Button
        variant="ghost"
        onClick={onSelect}
        disabled={disabled}
        className={`relative w-full aspect-square rounded-lg transition-all group ${getStatusClasses()} ${isSelected ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-background' : ''} ${isMyReservation ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''} disabled:opacity-70`}
        title={`Place ${space.number} - ${space.type}`}
      >
        <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold">{space.number}</span>
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
          {space.features.map((feature) => {
            const Icon = featureIcons[feature];
            return Icon ? <Icon key={feature} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-current opacity-80" /> : null;
          })}
        </div>
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TypeIcon className="w-4 h-4" />
        </div>
      </Button>
    </div>
  );
}