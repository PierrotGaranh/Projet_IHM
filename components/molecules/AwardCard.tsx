'use client';

import { Award } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

export function AwardCard() {
  const isMobile = useIsMobile();

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center space-y-4">
      <Award className="w-12 h-12 mx-auto text-primary" />
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
        Une équipe passionnée
      </h2>
      <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
        Derrière ParkHub, ce sont des experts en mobilité, développeurs et designers
        unis par la même vision : fluidifier le stationnement en ville.
      </p>
    </div>
  );
}