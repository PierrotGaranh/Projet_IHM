'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { validateField } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface EditReservationFormProps {
  reservation: { startDate: Date; endDate: Date; vehiclePlate: string; spaceId: string };
  pricePerHour: number;
  userPlates: string[];
  userName?: string;
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  onCancel: () => void;
}

export function EditReservationForm({ reservation, pricePerHour, userPlates, userName, onSubmit, onCancel }: EditReservationFormProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }>({
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    startTime: reservation.startDate.toTimeString().slice(0, 5),
    endTime: reservation.endDate.toTimeString().slice(0, 5),
  });
  const [vehiclePlate, setVehiclePlate] = useState(reservation.vehiclePlate);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [errors, setErrors] = useState<{ date?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDateRangeChanged, setHasDateRangeChanged] = useState(false);

  const originalStart = reservation.startDate;
  const originalEnd = reservation.endDate;
  const originalStartTime = reservation.startDate.toTimeString().slice(0, 5);
  const originalEndTime = reservation.endDate.toTimeString().slice(0, 5);

  const validatePlate = (plate: string) => {
    const error = validateField('plate', plate);
    setErrors(prev => ({ ...prev, plate: error }));
    return !error;
  };

  const handlePlateChange = (plate: string) => {
    setVehiclePlate(plate);
    validatePlate(plate);
  };

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const [sh, sm] = dateRange.startTime.split(':').map(Number);
      start.setHours(sh, sm);
      const end = new Date(dateRange.endDate);
      const [eh, em] = dateRange.endTime.split(':').map(Number);
      end.setHours(eh, em);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours > 0) setEstimatedPrice(Math.round(hours * pricePerHour * 100) / 100);
      else setEstimatedPrice(0);

      const isChanged =
        start.getTime() !== originalStart.getTime() ||
        end.getTime() !== originalEnd.getTime() ||
        dateRange.startTime !== originalStartTime ||
        dateRange.endTime !== originalEndTime;
      setHasDateRangeChanged(isChanged);
    } else {
      setHasDateRangeChanged(false);
    }
  }, [dateRange, pricePerHour, originalStart, originalEnd, originalStartTime, originalEndTime]);

  const isFormValid = () => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    const start = new Date(dateRange.startDate);
    const [sh, sm] = dateRange.startTime.split(':').map(Number);
    start.setHours(sh, sm);
    const end = new Date(dateRange.endDate);
    const [eh, em] = dateRange.endTime.split(':').map(Number);
    end.setHours(eh, em);
    if (start >= end) return false;
    if (!vehiclePlate.trim()) return false;
    if (errors.plate) return false;
    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;
    const start = new Date(dateRange.startDate!);
    const [sh, sm] = dateRange.startTime.split(':').map(Number);
    start.setHours(sh, sm);
    const end = new Date(dateRange.endDate!);
    const [eh, em] = dateRange.endTime.split(':').map(Number);
    end.setHours(eh, em);
    setIsSubmitting(true);
    try {
      await onSubmit({ startDate: start, endDate: end, vehiclePlate });
    } catch (err) {
      toast({ variant: 'error', title: 'Erreur', description: err instanceof Error ? err.message : 'Échec de la modification' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userName && (
        <div>
          <Label>Utilisateur</Label>
          <div className="mt-1 p-2 bg-muted rounded text-sm">{userName}</div>
        </div>
      )}
      <div className="bg-muted/30 p-3 rounded-lg space-y-1 text-sm">
        <p className="font-medium">Réservation actuelle :</p>
        <p>Place : {reservation.spaceId}</p>
        <p>Période : {reservation.startDate.toLocaleString('fr-FR')} → {reservation.endDate.toLocaleString('fr-FR')}</p>
        <p>Véhicule : {reservation.vehiclePlate}</p>
      </div>
      <div>
        <Label>Nouvelle période</Label>
        <DateRangePicker
          onChange={(range) => setDateRange({
            startDate: range.startDate,
            endDate: range.endDate,
            startTime: range.startTime,
            endTime: range.endTime,
          })}
          value={dateRange}
        />
      </div>
      <VehiclePlateInput
        value={vehiclePlate}
        onChange={handlePlateChange}
        options={userPlates}
        label="Plaque du véhicule"
        error={errors.plate}
      />
      {hasDateRangeChanged && estimatedPrice > 0 && (
        <p className="text-sm text-primary font-semibold">Nouveau prix estimé : {estimatedPrice} €</p>
      )}
      <div className="flex gap-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Mise à jour"
          disabled={!isFormValid()}
          className="flex-1"
        >
          Mettre à jour
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  );
}