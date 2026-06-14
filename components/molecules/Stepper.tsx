'use client';

import { useIsMobile } from '@/hooks/use-mobile';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function Stepper({ currentStep, totalSteps, labels }: StepperProps) {
  const isMobile = useIsMobile();
  const progress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="pt-4">
      <div className={`flex justify-between text-xs mb-1 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
        {labels.map((label, idx) => (
          <span key={idx} className={currentStep >= idx ? 'text-primary font-medium' : 'text-muted-foreground'}>
            {isMobile && idx !== currentStep ? (idx === 0 ? '1' : idx === 1 ? '2' : '3') : label}
          </span>
        ))}
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300 ease-out rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-1">Étape {currentStep + 1} sur {totalSteps}</p>
    </div>
  );
}