'use client';

import { ParkingSpace, ParkingLevel } from '@/lib/types';
import { ParkingSpaceCell } from '@/components/molecules/ParkingSpaceCell';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Info, X, Edit, Trash2, Minimize2, CarFront, Crown, Accessibility, Plug, Camera, ShieldCheck } from 'lucide-react';

interface ParkingGridProps {
  levels: ParkingLevel[];
  selectedSpaceId?: string;
  onSelectSpace: (space: ParkingSpace) => void;
  userReservedSpaceIds?: Set<string>;
  onEditReservation?: (space: ParkingSpace) => void;
  onCancelReservation?: (space: ParkingSpace) => void;
  isAdmin?: boolean;
  adminSelectableStatuses?: string[];
}

export function ParkingGrid({
  levels,
  selectedSpaceId,
  onSelectSpace,
  userReservedSpaceIds = new Set(),
  onEditReservation,
  onCancelReservation,
  isAdmin = false,
  adminSelectableStatuses = ['available', 'maintenance'],
}: ParkingGridProps) {
  const isMobile = useIsMobile(600);
  const [showLegend, setShowLegend] = useState(false);
  const [mobileActionSpace, setMobileActionSpace] = useState<ParkingSpace | null>(null);

  const canSelect = (space: ParkingSpace) => {
    if (isAdmin) return adminSelectableStatuses.includes(space.status);
    return space.status === 'available';
  };

  const handleMobileReservationClick = (space: ParkingSpace) => {
    if (canSelect(space)) {
      onSelectSpace(space);
    } else if (userReservedSpaceIds.has(space.id) && !isAdmin && onEditReservation && onCancelReservation) {
      setMobileActionSpace(space);
    }
  };

  const closeMobileModal = () => setMobileActionSpace(null);

  const gridColsClass = isMobile ? 'grid-cols-4' : 'grid-cols-5 sm:grid-cols-6';

  return (
    <div className="space-y-6">
      {levels.map((level) => (
        <Card key={level.level} className="p-3 sm:p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Niveau {level.level}</h2>
            <div className="text-xs sm:text-sm text-muted-foreground">{Math.round(level.occupancyRate)}% occupé</div>
          </div>
          <div className={`grid ${gridColsClass} gap-2`}>
            {level.spaces.map((space) => {
              const isMyReservation = userReservedSpaceIds.has(space.id);
              const isSelected = selectedSpaceId === space.id;
              const disabled = !canSelect(space) && !isMyReservation;
              const handleClick = () => {
                if (isMobile) {
                  handleMobileReservationClick(space);
                } else if (canSelect(space)) {
                  onSelectSpace(space);
                }
              };

              const cell = (
                <ParkingSpaceCell
                  key={space.id}
                  space={space}
                  isSelected={isSelected}
                  isMyReservation={isMyReservation}
                  onSelect={handleClick}
                  disabled={disabled}
                  isMobile={isMobile}
                />
              );

              if (!isMobile && isMyReservation && !isAdmin && onEditReservation && onCancelReservation) {
                return (
                  <div key={space.id} className="relative z-0 hover:z-20">
                    {cell}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-all duration-200 rounded-lg">
                      <Button
                        variant="ghost"
                        onClick={(e) => {e.stopPropagation(); onEditReservation(space);}}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md shadow-md transition-all hover:scale-105"
                      >
                        <Edit className="w-3 h-3" />Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={(e) => {e.stopPropagation(); onCancelReservation(space);}}
                        className="flex items-center gap-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-medium px-3 py-1.5 rounded-md shadow-md transition-all hover:scale-105"
                      >
                        <Trash2 className="w-3 h-3" />Annuler
                      </Button>
                    </div>
                  </div>
                );
              }

              return cell;
            })}
          </div>
          {isMobile ? (
            <div className="pt-2 border-t border-border">
              <Button variant="ghost" onClick={() => setShowLegend(!showLegend)} className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" /> Légende
              </Button>
              {showLegend && (
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500"></div><span>Dispo</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500 opacity-70"></div><span>Occ</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-400"></div><span>Maint</span></div>
                  {!isAdmin && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded ring-2 ring-yellow-400"></div><span>Ma résa</span></div>}
                  <div className="flex items-center gap-1"><Minimize2 className="w-3 h-3 text-blue-600" /><span>Compact</span></div>
                  <div className="flex items-center gap-1"><CarFront className="w-3 h-3 text-gray-600" /><span>Standard</span></div>
                  <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-600" /><span>Premium</span></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 text-xs pt-2 border-t border-border">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500"></div><span>Disponible</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500 opacity-70"></div><span>Occupée</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-400"></div><span>Maintenance</span></div>
              {!isAdmin && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded ring-2 ring-yellow-400"></div><span>Ma réservation</span></div>}
              <div className="flex items-center gap-1"><Minimize2 className="w-3 h-3 text-blue-600" /><span>Compact</span></div>
              <div className="flex items-center gap-1"><CarFront className="w-3 h-3 text-gray-600" /><span>Standard</span></div>
              <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-600" /><span>Premium</span></div>
              <div className="flex items-center gap-1"><Accessibility className="w-3 h-3" /><span>Handicap</span></div>
              <div className="flex items-center gap-1"><Plug className="w-3 h-3" /><span>Chargeur</span></div>
              <div className="flex items-center gap-1"><Camera className="w-3 h-3" /><span>Surveillée</span></div>
              <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /><span>Sécurisée</span></div>
            </div>
          )}
        </Card>
      ))}
      {mobileActionSpace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeMobileModal}>
          <div className="bg-card rounded-lg p-6 max-w-xs w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Place {mobileActionSpace.number}</h3>
              <button onClick={closeMobileModal} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground">Procéder à une action pour la réservation:</p>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => { closeMobileModal(); onEditReservation?.(mobileActionSpace); }} className="flex-1 inline-flex items-center justify-center gap-1">
                <Edit className="w-4 h-4" />Le modifier
              </Button>
              <Button variant="secondary" onClick={() => { closeMobileModal(); onCancelReservation?.(mobileActionSpace); }} className="flex-1 border-destructive text-destructive hover:bg-destructive/10 inline-flex items-center justify-center gap-1">
                <Trash2 className="w-4 h-4" />L'annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}