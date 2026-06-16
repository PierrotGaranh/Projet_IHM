'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { validateForm } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface ReserveSpaceFormProps {
  spaceId: string;
  pricePerHour: number;
  userPlates: string[];
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  initialData?: { startDate: Date; endDate: Date; vehiclePlate: string };
  isEditing?: boolean;
  onClose?: () => void;
}

const UPDATE_FEE = 1;

export function ReserveSpaceForm({
  pricePerHour,
  userPlates,
  onSubmit,
  initialData,
  isEditing,
  onClose,
}: ReserveSpaceFormProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }>({
    startDate: null,
    endDate: null,
    startTime: '09:00',
    endTime: '17:00',
  });
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [errors, setErrors] = useState<{ dates?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const plateInputRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setDateRange({
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        startTime: initialData.startDate.toTimeString().slice(0,5),
        endTime: initialData.endDate.toTimeString().slice(0,5),
      });
      setVehiclePlate(initialData.vehiclePlate);
    }
  }, [initialData]);

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
    }
  }, [dateRange, pricePerHour]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dateRange.startDate || !dateRange.endDate) {
      setErrors({ dates: 'Veuillez sélectionner une plage horaire' });
      if (datePickerRef.current) datePickerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      if (validationErrors.dates && datePickerRef.current) {
        datePickerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.plate && plateInputRef.current) {
        plateInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ startDate: start, endDate: end, vehiclePlate });
    } catch (err) {
      toast({ variant: 'error', title: 'Erreur', description: err instanceof Error ? err.message : 'Une erreur est survenue' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = estimatedPrice > 0 ? estimatedPrice + (isEditing ? UPDATE_FEE : 0) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-foreground">Réserver cette place</h3>
          <Button type="button" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div ref={datePickerRef}>
        <Label>Période de réservation</Label>
        <DateRangePicker
          onChange={(range) => setDateRange({
            startDate: range.startDate,
            endDate: range.endDate,
            startTime: range.startTime,
            endTime: range.endTime,
          })}
          value={dateRange}
          placeholder="Sélectionner les dates et heures"
        />
        {errors.dates && <p className="text-sm text-destructive mt-1">{errors.dates}</p>}
      </div>

      <div ref={plateInputRef}>
        <VehiclePlateInput
          value={vehiclePlate}
          onChange={setVehiclePlate}
          options={userPlates}
          label="Plaque du véhicule"
          error={errors.plate}
        />
      </div>

      {totalPrice > 0 && (
        <div className="space-y-4 pt-2 border-t border-border">
          <p className="text-xl text-primary font-bold">
            {isEditing ? 'Nouveau prix (hors frais) :' : 'Prix estimé :'} {estimatedPrice.toFixed(2)} €
          </p>
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Frais de modification : {UPDATE_FEE.toFixed(2)} €
              <br />
              <span className="font-semibold text-primary">Total à payer : {totalPrice.toFixed(2)} €</span>
            </p>
          )}
        </div>
      )}

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
        {isEditing ? 'Modifier la réservation' : 'Confirmer la réservation'}
      </Button>
    </form>
  );
}