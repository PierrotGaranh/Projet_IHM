'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { validateForm } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'editReservationForm';

interface EditReservationFormProps {
  reservation: { startDate: Date; endDate: Date; vehiclePlate: string; spaceId: string; createdAt: Date };
  pricePerHour: number;
  userPlates: string[];
  userName?: string;
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string; amount: number }) => Promise<void>;
  onCancel: () => void;
}

function calculateUpdateFee(
  oldStart: Date, oldEnd: Date,
  newStart: Date, newEnd: Date,
  createdAt: Date,
  now: Date
): number {
  const hoursUntilStart = Math.max(0, (newStart.getTime() - now.getTime()) / (1000 * 60 * 60));
  let timeFee = 0;
  if (hoursUntilStart <= 1) timeFee = 10;
  else if (hoursUntilStart <= 4) timeFee = 7;
  else if (hoursUntilStart <= 12) timeFee = 5;
  else if (hoursUntilStart <= 24) timeFee = 3;
  else if (hoursUntilStart <= 48) timeFee = 2;
  else timeFee = 1;

  const oldDuration = (oldEnd.getTime() - oldStart.getTime()) / (1000 * 60 * 60);
  const newDuration = (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60);
  const durationChange = Math.abs(newDuration - oldDuration);
  let changeFee = 0;
  if (durationChange > 4) changeFee = 5;
  else if (durationChange > 2) changeFee = 3;
  else if (durationChange > 1) changeFee = 2;
  else if (durationChange > 0.5) changeFee = 1;

  const shiftHours = (newStart.getTime() - oldStart.getTime()) / (1000 * 60 * 60);
  let shiftFee = 0;
  if (shiftHours > 6) shiftFee = 3;
  else if (shiftHours > 3) shiftFee = 2;
  else if (shiftHours > 1) shiftFee = 1;

  const ageHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  let ageDiscount = 0;
  if (ageHours > 720) ageDiscount = 3;
  else if (ageHours > 168) ageDiscount = 2;
  else if (ageHours > 72) ageDiscount = 1;

  return Math.max(0, timeFee + changeFee + shiftFee - ageDiscount);
}

export function EditReservationForm({
  reservation,
  pricePerHour,
  userPlates,
  userName,
  onSubmit,
  onCancel,
}: EditReservationFormProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
  }>({
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
  const [updateFee, setUpdateFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const originalStart = reservation.startDate;
  const originalEnd = reservation.endDate;
  const originalStartTime = reservation.startDate.toTimeString().slice(0, 5);
  const originalEndTime = reservation.endDate.toTimeString().slice(0, 5);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.dateRange) {
          setDateRange({
            startDate: parsed.dateRange.startDate ? new Date(parsed.dateRange.startDate) : reservation.startDate,
            endDate: parsed.dateRange.endDate ? new Date(parsed.dateRange.endDate) : reservation.endDate,
            startTime: parsed.dateRange.startTime || reservation.startDate.toTimeString().slice(0, 5),
            endTime: parsed.dateRange.endTime || reservation.endDate.toTimeString().slice(0, 5),
          });
        }
        setVehiclePlate(parsed.vehiclePlate || reservation.vehiclePlate);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      dateRange: {
        startDate: dateRange.startDate?.toISOString() || null,
        endDate: dateRange.endDate?.toISOString() || null,
        startTime: dateRange.startTime,
        endTime: dateRange.endTime,
      },
      vehiclePlate,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [dateRange, vehiclePlate]);

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

  useEffect(() => {
    if (hasDateRangeChanged && dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const [sh, sm] = dateRange.startTime.split(':').map(Number);
      start.setHours(sh, sm);
      const end = new Date(dateRange.endDate);
      const [eh, em] = dateRange.endTime.split(':').map(Number);
      end.setHours(eh, em);
      const fee = calculateUpdateFee(
        originalStart,
        originalEnd,
        start,
        end,
        reservation.createdAt,
        new Date()
      );
      setUpdateFee(fee);
      setTotalAmount(estimatedPrice + fee);
    } else {
      setUpdateFee(0);
      setTotalAmount(estimatedPrice);
    }
  }, [hasDateRangeChanged, dateRange, estimatedPrice, originalStart, originalEnd, reservation.createdAt]);

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
      await onSubmit({
        startDate: start,
        endDate: end,
        vehiclePlate,
        amount: totalAmount,
      });
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      toast({
        variant: 'error',
        title: 'La modification de la réservation a échoué.',
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
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
        <p>
          Période : {reservation.startDate.toLocaleString('fr-FR')} →{' '}
          {reservation.endDate.toLocaleString('fr-FR')}
        </p>
        <p>Véhicule : {reservation.vehiclePlate}</p>
      </div>
      <div>
        <Label>Nouvelle période</Label>
        <DateRangePicker
          onChange={(range) =>
            setDateRange({
              startDate: range.startDate,
              endDate: range.endDate,
              startTime: range.startTime,
              endTime: range.endTime,
            })
          }
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
            Frais de modification : {updateFee.toFixed(2)} €
          </p>
          <p className="text-lg font-bold text-primary">
            Total à payer : {totalAmount.toFixed(2)} €
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
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
}