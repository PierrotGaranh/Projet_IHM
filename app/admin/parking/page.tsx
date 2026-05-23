'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import Loading from './loading';

function ParkingManagementPageContent() {
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'reserved' | 'maintenance'>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [changingSpaceId, setChangingSpaceId] = useState<string | null>(null);

  useEffect(() => {
    const store = getStore();
    const spaces = store.getSpaces();
    
    const groupedByLevel: Record<number, ParkingSpace[]> = {};
    spaces.forEach(space => {
      if (!groupedByLevel[space.level]) {
        groupedByLevel[space.level] = [];
      }
      groupedByLevel[space.level].push(space);
    });

    const levelArray = Object.keys(groupedByLevel)
      .map(level => ({
        level: parseInt(level),
        spaces: groupedByLevel[parseInt(level)],
        occupancyRate: (groupedByLevel[parseInt(level)].filter(s => s.status !== 'available').length / 
          groupedByLevel[parseInt(level)].length) * 100,
      }))
      .sort((a, b) => a.level - b.level);

    setLevels(levelArray);
  }, [refreshKey]);

  const handleStatusChange = async (spaceId: string, newStatus: string) => {
    setChangingSpaceId(spaceId);
    const store = getStore();
    store.updateSpace(spaceId, { status: newStatus as any });
    setRefreshKey(prev => prev + 1);
    setSelectedSpace(null);
    setChangingSpaceId(null);
  };

  const getSpaceStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      available: 'bg-secondary hover:bg-secondary/90 cursor-pointer',
      occupied: 'bg-destructive opacity-50',
      reserved: 'bg-primary opacity-50',
      maintenance: 'bg-muted opacity-50',
    };
    return statusColors[status] || 'bg-muted';
  };

  const filteredLevels = levels.filter(level => 
    filterLevel === 'all' ? true : level.level === filterLevel
  );

  const filteredSpaces = filteredLevels.flatMap(level => 
    level.spaces.filter(space => 
      filterStatus === 'all' ? true : space.status === filterStatus
    )
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion du parking</h1>
        <p className="text-muted-foreground">
          Gérez les statuts et configurations des places de parking
        </p>
      </div>

      {/* Filters */}
      <div className="card-base p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level Filter */}
          <div className="space-y-2">
            <label className="label-base">Filtre par niveau</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="input-base w-full"
            >
              <option value="all">Tous les niveaux</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>Niveau {level}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="label-base">Filtre par statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input-base w-full"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="occupied">Occupée</option>
              <option value="reserved">Réservée</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parking Grid */}
        <div className="lg:col-span-2 space-y-6">
          {filteredLevels.map(level => (
            <div key={level.level} className="card-base p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Niveau {level.level}</h2>
                <div className="text-sm text-muted-foreground">
                  {Math.round(level.occupancyRate)}% occupé
                </div>
              </div>

              {/* Parking Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {level.spaces.map(space => (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpace(space)}
                    className={`aspect-square rounded-lg transition-all font-semibold text-sm text-white cursor-pointer ${getSpaceStatusColor(space.status)} ${
                      selectedSpace?.id === space.id ? 'ring-2 ring-accent ring-offset-2' : ''
                    }`}
                    title={`Place ${space.number} - ${space.type}`}
                  >
                    {space.number}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {selectedSpace ? (
            <div className="card-base p-6 space-y-4 sticky top-24">
              <h3 className="font-semibold text-foreground text-lg">Détails de la place</h3>
              
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Numéro</p>
                  <p className="font-semibold text-foreground text-lg">{selectedSpace.number}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Niveau</p>
                  <p className="font-semibold text-foreground">{selectedSpace.level}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-semibold text-foreground capitalize">{selectedSpace.type}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Prix/heure</p>
                  <p className="font-semibold text-foreground">{selectedSpace.pricePerHour}€</p>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold">ÉQUIPEMENTS</p>
                  {selectedSpace.features.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSpace.features.map(feature => (
                        <span
                          key={feature}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Aucun équipement</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">CHANGER LE STATUT</p>
                <div className="space-y-2">
                  {['available', 'occupied', 'reserved', 'maintenance'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedSpace.id, status)}
                      disabled={changingSpaceId === selectedSpace.id}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        selectedSpace.status === status
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      } ${changingSpaceId === selectedSpace.id ? 'opacity-50' : ''}`}
                    >
                      {changingSpaceId === selectedSpace.id ? <LoadingDots /> : (status === 'available' ? 'Disponible' : status === 'occupied' ? 'Occupée' : status === 'reserved' ? 'Réservée' : 'Maintenance')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-base p-6 text-center text-muted-foreground space-y-2">
              <p className="text-lg">P</p>
              <p>Sélectionnez une place</p>
              <p className="text-xs">pour voir les détails</p>
            </div>
          )}

          {/* Stats */}
          <div className="card-base p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Statistiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total places</span>
                <span className="font-semibold">{filteredSpaces.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disponibles</span>
                <span className="font-semibold text-secondary">
                  {filteredSpaces.filter(s => s.status === 'available').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupées</span>
                <span className="font-semibold text-destructive">
                  {filteredSpaces.filter(s => s.status === 'occupied').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Réservées</span>
                <span className="font-semibold text-primary">
                  {filteredSpaces.filter(s => s.status === 'reserved').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParkingManagementPage() {return <Suspense fallback={<Loading />}><ParkingManagementPageContent /></Suspense>};
