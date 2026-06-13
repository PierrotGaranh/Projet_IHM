'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { validateDates, validateField } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface ReserveSpaceFormProps {
  spaceId: string;
  pricePerHour: number;
  userPlates: string[];
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  initialData?: { startDate: Date; endDate: Date; vehiclePlate: string };
  isEditing?: boolean;
}

export function ReserveSpaceForm({ pricePerHour, userPlates, onSubmit, initialData, isEditing }: ReserveSpaceFormProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }>({
    startDate: null,
    endDate: null,
    startTime: '09:00',
    endTime: '17:00',
  });
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [errors, setErrors] = useState<{ date?: string; plate?: string }>({});
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
      setErrors({ date: 'Veuillez sélectionner une plage horaire' });
      if (datePickerRef.current) datePickerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const start = new Date(dateRange.startDate);
    const [sh, sm] = dateRange.startTime.split(':').map(Number);
    start.setHours(sh, sm);
    const end = new Date(dateRange.endDate);
    const [eh, em] = dateRange.endTime.split(':').map(Number);
    end.setHours(eh, em);
    const dateError = validateDates(start, end);
    const plateError = validateField('plate', vehiclePlate);
    const newErrors = { date: dateError, plate: plateError };
    setErrors(newErrors);
    if (dateError || plateError) {
      if (dateError && datePickerRef.current) datePickerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (plateError && plateInputRef.current) plateInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
      {estimatedPrice > 0 && 
        <div className="space-y-4 pt-2 border-t border-border">
          <p className="text-xl text-primary font-bold">Prix estimé : {estimatedPrice} €</p>
        </div>
      }
      <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
        {isEditing ? 'Modifier la réservation' : 'Confirmer la réservation'}
      </Button>
    </form>
  );
}