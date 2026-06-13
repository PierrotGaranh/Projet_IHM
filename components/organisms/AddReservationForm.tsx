'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { VehiclePlateInput } from '@/components/molecules/VehiclePlateInput';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { validateField } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';
import { Search, ChevronDown, X } from 'lucide-react';

interface AddReservationFormProps {
  users: { id: string; firstName: string; lastName: string; email: string; vehiclePlates: string[] }[];
  onSubmit: (data: { userId: string; startDate: Date; endDate: Date; vehiclePlate: string }) => Promise<void>;
  onCancel: () => void;
}

export function AddReservationForm({ users, onSubmit, onCancel }: AddReservationFormProps) {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validatePlate = (plate: string) => {
    const error = validateField('plate', plate);
    setErrors(prev => ({ ...prev, plate: error }));
    return !error;
  };

  const handlePlateChange = (plate: string) => {
    setVehiclePlate(plate);
    validatePlate(plate);
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: typeof users[0]) => {
    setSelectedUserId(user.id);
    setSelectedUser(user);
    setSearchTerm(`${user.firstName} ${user.lastName} (${user.email})`);
    setIsDropdownOpen(false);
    setErrors(prev => ({ ...prev, user: undefined }));
  };

  const clearSelectedUser = () => {
    setSelectedUserId('');
    setSelectedUser(null);
    setSearchTerm('');
    setVehiclePlateOptions([]);
    setVehiclePlate('');
    setErrors(prev => ({ ...prev, user: undefined, plate: undefined }));
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
      <div className="space-y-1" ref={dropdownRef}>
        <Label>Utilisateur</Label>
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  if (selectedUserId) clearSelectedUser();
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Rechercher par nom, prénom ou email..."
                className="input-base w-full pr-8"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            {selectedUserId && (
              <Button type="button" variant="ghost" onClick={clearSelectedUser} className="p-2 text-destructive">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">Aucun utilisateur trouvé</div>
              ) : (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {errors.user && <p className="text-xs text-destructive">{errors.user}</p>}
      </div>

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