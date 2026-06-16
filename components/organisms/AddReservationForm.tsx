'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { UserSearchSelect } from '@/components/molecules/UserSearchSelect';
import { validateField } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface AddReservationFormProps {
  users: { id: string; firstName: string; lastName: string; email: string; vehiclePlates: string[] }[];
  onSubmit: (data: { userId: string; startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  onCancel: () => void;
}

export function AddReservationForm({ users, onSubmit, onCancel }: AddReservationFormProps) {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }>({
    startDate: null,
    endDate: null,
    startTime: '09:00',
    endTime: '17:00',
  });
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehiclePlateOptions, setVehiclePlateOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ user?: string; date?: string; plate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        setSelectedUser(user);
        setVehiclePlateOptions(user.vehiclePlates);
        setVehiclePlate('');
      }
    } else {
      setSelectedUser(null);
      setVehiclePlateOptions([]);
    }
  }, [selectedUserId, users]);

  const validatePlate = (plate: string) => {
    const error = validateField('plate', plate);
    setErrors(prev => ({ ...prev, plate: error }));
    return !error;
  };

  const handlePlateChange = (plate: string) => {
    setVehiclePlate(plate);
    validatePlate(plate);
  };

  const isFormValid = () => {
    if (!selectedUserId) return false;
    if (!vehiclePlate.trim()) return false;
    if (errors.plate) return false;
    if (!dateRange.startDate || !dateRange.endDate) return false;
    const start = new Date(dateRange.startDate);
    const [sh, sm] = dateRange.startTime.split(':').map(Number);
    start.setHours(sh, sm);
    const end = new Date(dateRange.endDate);
    const [eh, em] = dateRange.endTime.split(':').map(Number);
    end.setHours(eh, em);
    if (start >= end) return false;
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
      await onSubmit({ userId: selectedUserId, startDate: start, endDate: end, vehiclePlate });
    } catch (err) {
      toast({ variant: 'error', title: 'Erreur', description: err instanceof Error ? err.message : 'Échec de la création' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <UserSearchSelect
        users={users}
        value={selectedUserId}
        onChange={(id) => {
          setSelectedUserId(id);
          setErrors(prev => ({ ...prev, user: undefined }));
        }}
        label="Utilisateur"
        placeholder="Rechercher par nom, prénom ou email..."
        error={errors.user}
      />

      <VehiclePlateInput
        value={vehiclePlate}
        onChange={handlePlateChange}
        options={vehiclePlateOptions}
        label="Plaque du véhicule"
        error={errors.plate}
      />

      <div>
        <Label>Période de réservation</Label>
        <DateRangePicker
          onChange={(range) => setDateRange({
            startDate: range.startDate,
            endDate: range.endDate,
            startTime: range.startTime,
            endTime: range.endTime,
          })}
          value={dateRange}
        />
        {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText="Enregistrement"
          disabled={!isFormValid()}
          className="flex-1"
        >
          Ajouter
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  );
}