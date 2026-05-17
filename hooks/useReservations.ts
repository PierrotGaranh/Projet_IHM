import { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';

export function useUserReservations(userId: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const store = getStore();
    const userRes = store.getUserReservations(userId);
    setReservations(userRes);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      refresh();
    }
  }, [userId]);

  return { reservations, loading, refresh };
}

export function useAllReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    const store = getStore();
    const allRes = store.getReservations();
    setReservations(allRes);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { reservations, loading, refresh };
}

export function useReservation(reservationId: string) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = getStore();
    const res = store.getReservation(reservationId);
    setReservation(res || null);
    setLoading(false);
  }, [reservationId]);

  return { reservation, loading };
}
