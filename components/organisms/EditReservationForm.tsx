'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { validateForm } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface EditReservationFormProps {
  reservation: { startDate: Date; endDate: Date; vehiclePlate: string; spaceId: string };
  pricePerHour: number;
  userPlates: string[];
  userName?: string;
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  onCancel: () => void;
}

const UPDATE_FEE = 5;

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
  const [errors, setErrors] = useState<{ dates?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDateRangeChanged, setHasDateRangeChanged] = useState(false);

  const originalStart = reservation.startDate;
  const originalEnd = reservation.endDate;
  const originalStartTime = reservation.startDate.toTimeString().slice(0, 5);
  const originalEndTime = reservation.endDate.toTimeString().slice(0, 5);

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dateRange.startDate || !dateRange.endDate) {
      setErrors({ dates: 'Veuillez sélectionner une plage horaire' });
      return;
    }
    const start = new Date(dateRange.startDate);
    const [sh, sm] = dateRange.startTime.split(':').map(Number);
    start.setHours(sh, sm);
    const end = new Date(dateRange.endDate);
    const [eh, em] = dateRange.endTime.split(':').map(Number);
    end.setHours(eh, em);

    const formData = { startDate: start, endDate: end, plate: vehiclePlate };
    const validationErrors = validateForm(formData, ['dates', 'plate']);
    setErrors(validationErrors);
    if (validationErrors.dates || validationErrors.plate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ startDate: start, endDate: end, vehiclePlate });
    } catch (err) {
      toast({ variant: 'error', title: 'Erreur', description: err instanceof Error ? err.message : 'Échec de la modification' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = estimatedPrice > 0 ? estimatedPrice + UPDATE_FEE : 0;

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
        {errors.dates && <p className="text-xs text-destructive mt-1">{errors.dates}</p>}
      </div>
      <VehiclePlateInput
        value={vehiclePlate}
        onChange={setVehiclePlate}
        options={userPlates}
        label="Plaque du véhicule"
        error={errors.plate}
      />

      {hasDateRangeChanged && estimatedPrice > 0 && (
        <div className="pt-2 border-t border-border space-y-1">
          <p className="text-sm text-muted-foreground">
            Nouveau prix (hors frais) : {estimatedPrice.toFixed(2)} €
          </p>
          <p className="text-sm text-muted-foreground">
            Frais de modification : {UPDATE_FEE.toFixed(2)} €
          </p>
          <p className="text-lg font-bold text-primary">
            Total à payer : {totalPrice.toFixed(2)} €
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Mise à jour"
          disabled={isSubmitting}
          className="flex-1"
        >
          Mettre à jour
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  );
}