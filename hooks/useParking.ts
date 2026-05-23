import { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel, ParkingStats } from '@/lib/types';

export function useParkingSpaces() {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const store = getStore();
    const allSpaces = store.getSpaces();
    setSpaces(allSpaces);

    const groupedByLevel: Record<number, ParkingSpace[]> = {};
    allSpaces.forEach(space => {
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
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { spaces, levels, loading, refresh };
}

export function useParkingStats() {
  const [stats, setStats] = useState<ParkingStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const store = getStore();
    const parkingStats = store.getParkingStats();
    setStats(parkingStats);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { stats, loading, refresh };
}

export function useSpace(spaceId: string) {
  const [space, setSpace] = useState<ParkingSpace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = getStore();
    const foundSpace = store.getSpace(spaceId);
    setSpace(foundSpace || null);
    setLoading(false);
  }, [spaceId]);

  return { space, loading };
}
