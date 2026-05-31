'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select } from '@/components/atoms/Select';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { validateDates, validateField } from '@/lib/validation';

interface AddReservationFormProps {
  users: { id: string; firstName: string; lastName: string; email: string; vehiclePlates: string[] }[];
  onSubmit: (data: { userId: string; startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  onCancel: () => void;
}

export function AddReservationForm({ users, onSubmit, onCancel }: AddReservationFormProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehiclePlateOptions, setVehiclePlateOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ user?: string; date?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setVehiclePlateOptions(user.vehiclePlates);
      setVehiclePlate('');
    } else {
      setVehiclePlateOptions([]);
    }
  }, [selectedUserId, users]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { user?: string; date?: string; plate?: string } = {};
    if (!selectedUserId) newErrors.user = 'Veuillez sélectionner un utilisateur';
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const dateError = validateDates(start, end);
    if (dateError) newErrors.date = dateError;
    const plateError = validateField('plate', vehiclePlate);
    if (plateError) newErrors.plate = plateError;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    await onSubmit({ userId: selectedUserId, startDate: start, endDate: end, vehiclePlate });
    setIsSubmitting(false);
  };

  const userOptions = users.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} (${u.email})` }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Utilisateur</Label>
        <Select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          options={[{ value: '', label: 'Sélectionnez un utilisateur' }, ...userOptions]}
          error={errors.user}
          required
        />
      </div>
      <VehiclePlateInput
        value={vehiclePlate}
        onChange={setVehiclePlate}
        options={vehiclePlateOptions}
        label="Plaque du véhicule"
        error={errors.plate}
      />
      <div><Label>Date de début</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required /></div>
      <div><Label>Heure de début</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></div>
      <div><Label>Date de fin</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} required /></div>
      <div><Label>Heure de fin</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></div>
      {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isSubmitting} loadingText="Enregistrement" className="flex-1">Créer</Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  );
}