'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { validateDates, validateField } from '@/lib/validation';

interface ReserveSpaceFormProps {
  spaceId: string;
  pricePerHour: number;
  userPlates: string[];
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  initialData?: { startDate: Date; endDate: Date; vehiclePlate: string };
  isEditing?: boolean;
}

export function ReserveSpaceForm({ spaceId, pricePerHour, userPlates, onSubmit, initialData, isEditing = false }: ReserveSpaceFormProps) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [errors, setErrors] = useState<{ date?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    if (initialData) {
      setStartDate(initialData.startDate.toISOString().split('T')[0]);
      setStartTime(initialData.startDate.toTimeString().slice(0,5));
      setEndDate(initialData.endDate.toISOString().split('T')[0]);
      setEndTime(initialData.endDate.toTimeString().slice(0,5));
      setVehiclePlate(initialData.vehiclePlate);
    }
  }, [initialData]);

  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours > 0) setEstimatedPrice(Math.round(hours * pricePerHour * 100) / 100);
      else setEstimatedPrice(0);
    }
  }, [startDate, startTime, endDate, endTime, pricePerHour]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const dateError = validateDates(start, end);
    const plateError = validateField('plate', vehiclePlate);
    setErrors({ date: dateError, plate: plateError });
    if (dateError || plateError) return;
    setIsSubmitting(true);
    await onSubmit({ startDate: start, endDate: end, vehiclePlate });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label>Date de début</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required /></div>
      <div><Label>Heure de début</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></div>
      <div><Label>Date de fin</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} required /></div>
      <div><Label>Heure de fin</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></div>
      <VehiclePlateInput value={vehiclePlate} onChange={setVehiclePlate} options={userPlates} label="Plaque du véhicule" error={errors.plate} />
      {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
      <Button type="submit" isLoading={isSubmitting} loadingText={isEditing ? "Modification" : "Réservation"} className="w-full">{isEditing ? "Modifier la réservation" : "Confirmer la réservation"}</Button>
    </form>
  );
}