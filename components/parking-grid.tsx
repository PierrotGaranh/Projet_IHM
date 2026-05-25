'use client';

import { ParkingSpace, ParkingLevel } from '@/lib/types';
import { Plug, Home, ShieldCheck, Minimize2, CarFront, Crown, Accessibility, Info, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface ParkingGridProps {
  levels: ParkingLevel[];
  selectedSpaceId?: string;
  onSelectSpace: (space: ParkingSpace) => void;
  userReservedSpaceIds?: Set<string>;
  onEditReservation?: (space: ParkingSpace) => void;
  onCancelReservation?: (space: ParkingSpace) => void;
  isAdmin?: boolean;
}

const featureIcons: Record<string, React.ElementType> = {
  handicap: Accessibility,
  chargeur: Plug,
  abritée: Home,
  sécurisée: ShieldCheck,
};

// Pour mobile, on garde la bordure colorée en bas
const typeColor = {
  compact: 'border-b-2 border-blue-400',
  standard: 'border-b-2 border-gray-400',
  premium: 'border-b-2 border-yellow-500',
};

export function ParkingGrid({
  levels,
  selectedSpaceId,
  onSelectSpace,
  userReservedSpaceIds = new Set(),
  onEditReservation,
  onCancelReservation,
  isAdmin = false,
}: ParkingGridProps) {
  const isMobile = useIsMobile();
  const [showLegend, setShowLegend] = useState(false);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200 cursor-pointer';
      case 'occupied':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 opacity-70 cursor-not-allowed';
      case 'reserved':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 opacity-70 cursor-not-allowed';
      case 'maintenance':
        return 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 opacity-70 cursor-not-allowed';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Version mobile (inchangée)
  const renderMobileCell = (space: ParkingSpace, isMyReservation: boolean, isSelected: boolean) => (
    <button
      key={space.id}
      onClick={() => {
        if (space.status === 'available') {
          onSelectSpace(space);
        } else if (isMyReservation && !isAdmin && onEditReservation) {
          onEditReservation(space);
        }
      }}
      disabled={space.status !== 'available' && !isMyReservation}
      className={`
        relative w-full aspect-square rounded-lg transition-all font-bold text-base
        ${getStatusClasses(space.status)}
        ${isSelected ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-background' : ''}
        ${isMyReservation && !isAdmin ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}
        disabled:opacity-70
        ${typeColor[space.type]}
      `}
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
    </button>
  );

  // Version desktop : icône PCS invisible par défaut, visible au survol
  const renderDesktopCell = (space: ParkingSpace, isMyReservation: boolean, isSelected: boolean) => {
    const TypeIcon = space.type === 'compact' ? Minimize2 : space.type === 'standard' ? CarFront : Crown;

    return (
      <div key={space.id} className="relative">
        <button
          onClick={() => {
            if (space.status === 'available') {
              onSelectSpace(space);
            }
          }}
          disabled={space.status !== 'available' && !isMyReservation}
          className={`
            relative w-full aspect-square rounded-lg transition-all group
            ${getStatusClasses(space.status)}
            ${isSelected ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-background' : ''}
            ${isMyReservation && !isAdmin ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}
            disabled:opacity-70
          `}
          title={`Place ${space.number} - ${space.type} - ${space.features.join(', ')}`}
        >
          {/* Numéro de place : grand et centré */}
          <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold">
            {space.number}
          </span>

          {/* Équipements : en bas, centrés */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {space.features.map((feature) => {
              const Icon = featureIcons[feature];
              return Icon ? <Icon key={feature} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-current opacity-80" /> : null;
            })}
          </div>

          {/* Icône PCS (Premium, Compact, Standard) : visible uniquement au survol */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TypeIcon className="w-4 h-4" />
          </div>
        </button>

        {/* Boutons d'action (survol) - design modernisé */}
        {isMyReservation && !isAdmin && onEditReservation && onCancelReservation && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-all duration-200 rounded-lg">
            <button
              onClick={(e) => { e.stopPropagation(); onEditReservation(space); }}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md shadow-md transition-all hover:scale-105 cursor-pointer"
              role="button"
              tabIndex={0}
            ><Edit className="w-3 h-3" />Modifier
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCancelReservation(space); }}
              className="flex items-center gap-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-medium px-3 py-1.5 rounded-md shadow-md transition-all hover:scale-105 cursor-pointer"
              role="button"
              tabIndex={0}
            ><Trash2 className="w-3 h-3" />Annuler
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {levels.map((level) => (
        <div key={level.level} className="card-base p-3 sm:p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Niveau {level.level}</h2>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {Math.round(level.occupancyRate)}% occupé
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {level.spaces.map((space) => {
              const isMyReservation = userReservedSpaceIds.has(space.id);
              const isSelected = selectedSpaceId === space.id;
              return isMobile
                ? renderMobileCell(space, isMyReservation, isSelected)
                : renderDesktopCell(space, isMyReservation, isSelected);
            })}
          </div>

          {/* Légende */}
          {isMobile ? (
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <Info className="w-3 h-3" /> Légende
              </button>
              {showLegend && (
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500"></div><span>Dispo</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500 opacity-70"></div><span>Occ</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500 opacity-70"></div><span>Rés</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-400"></div><span>Maint</span></div>
                  {!isAdmin && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded ring-2 ring-yellow-400"></div><span>Ma résa</span></div>}
                  <div className="flex items-center gap-1"><div className="w-3 border-b-2 border-blue-400"></div><span>Compact</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 border-b-2 border-gray-400"></div><span>Standard</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 border-b-2 border-yellow-500"></div><span>Premium</span></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 text-xs pt-2 border-t border-border">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500"></div><span>Disponible</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500 opacity-70"></div><span>Occupée</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500 opacity-70"></div><span>Réservée</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-400"></div><span>Maintenance</span></div>
              {!isAdmin && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded ring-2 ring-yellow-400"></div><span>Ma réservation</span></div>}
              <div className="flex items-center gap-1"><Minimize2 className="w-3 h-3 text-blue-600" /><span>Compact</span></div>
              <div className="flex items-center gap-1"><CarFront className="w-3 h-3 text-gray-600" /><span>Standard</span></div>
              <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-600" /><span>Premium</span></div>
              <div className="flex items-center gap-1"><Accessibility className="w-3 h-3" /><span>Handicap</span></div>
              <div className="flex items-center gap-1"><Plug className="w-3 h-3" /><span>Chargeur</span></div>
              <div className="flex items-center gap-1"><Home className="w-3 h-3" /><span>Abritée</span></div>
              <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /><span>Sécurisée</span></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}