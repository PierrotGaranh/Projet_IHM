// components/organisms/EditReservationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { validateDates, validateField } from '@/lib/validation';

interface EditReservationFormProps {
  reservation: { startDate: Date; endDate: Date; vehiclePlate: string; spaceId: string };
  pricePerHour: number;
  userPlates: string[];
  userName?: string;
  onSubmit: (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  onCancel: () => void;
}

export function EditReservationForm({ reservation, pricePerHour, userPlates, userName, onSubmit, onCancel }: EditReservationFormProps) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [errors, setErrors] = useState<{ date?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStartDate(reservation.startDate.toISOString().split('T')[0]);
    setStartTime(reservation.startDate.toTimeString().slice(0,5));
    setEndDate(reservation.endDate.toISOString().split('T')[0]);
    setEndTime(reservation.endDate.toTimeString().slice(0,5));
    setVehiclePlate(reservation.vehiclePlate);
  }, [reservation]);

  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours > 0) setEstimatedPrice(Math.round(hours * pricePerHour * 100) / 100);
      else setEstimatedPrice(0);
    }
  }, [startDate, startTime, endDate, endTime, pricePerHour]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      {userName && (
        <div>
          <Label>Utilisateur</Label>
          <Input value={userName} disabled className="bg-muted" />
        </div>
      )}
      <div><Label>Date de début</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required /></div>
      <div><Label>Heure de début</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></div>
      <div><Label>Date de fin</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} required /></div>
      <div><Label>Heure de fin</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></div>
      <VehiclePlateInput value={vehiclePlate} onChange={setVehiclePlate} options={userPlates} label="Plaque du véhicule" error={errors.plate} />
      {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
      <div className="flex gap-3 pt-4">
        <Button variant="primary" type="submit" isLoading={isSubmitting} loadingText="Mise à jour" className="flex-1">Mettre à jour</Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  );
}