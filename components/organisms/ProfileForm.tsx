'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useToast } from '@/hooks/use-toast';
import { validateField } from '@/lib/validation';
import { useAuth } from '@/lib/context';

const STORAGE_KEY = 'profileForm';

interface ProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
    vehiclePlates: string[];
  };
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  readonly?: boolean;
}

export function ProfileForm({
  initialData,
  onSubmit,
  onCancel,
  readonly = false,
}: ProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [vehiclePlates, setVehiclePlates] = useState(
    initialData.vehiclePlates.length ? initialData.vehiclePlates : ['']
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (readonly) return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
        if (parsed.vehiclePlates) {
          setVehiclePlates(parsed.vehiclePlates.length ? parsed.vehiclePlates : ['']);
        }
      } catch {}
    }
  }, [readonly]);

  useEffect(() => {
    if (readonly) return;
    const dataToSave = { ...formData, vehiclePlates };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, vehiclePlates, readonly]);

  const handleChange = (field: string, value: string) => {
    if (readonly) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const updatePlate = (idx: number, value: string) => {
    if (readonly) return;
    const newPlates = [...vehiclePlates];
    newPlates[idx] = value;
    setVehiclePlates(newPlates);
    const error = validateField('plate', value);
    setErrors((prev) => ({ ...prev, [`plate_${idx}`]: error }));
  };

  const addPlate = () => {
    if (readonly) return;
    setVehiclePlates([...vehiclePlates, '']);
  };

  const removePlate = (idx: number) => {
    if (readonly) return;
    setVehiclePlates(vehiclePlates.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (readonly) return;

    const plateErrors: Record<string, string> = {};
    vehiclePlates.forEach((plate, idx) => {
      if (plate) {
        const err = validateField('plate', plate);
        if (err) plateErrors[`plate_${idx}`] = err;
      }
    });

    const fieldErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      phone: validateField('phone', formData.phone),
      ...plateErrors,
    };

    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some((e) => e)) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        ...formData,
        vehiclePlates: vehiclePlates.filter((p) => p.trim() !== ''),
      });
      if (success) {
        sessionStorage.removeItem(STORAGE_KEY);
        onCancel();
      }
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Oops',
        description:
          'Une erreur est survenue au mise à jour du profile. Veuillez réessayez.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (readonly) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground text-lg">
            Informations de contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Prénom</Label>
              <p className="text-foreground py-2">{initialData.firstName}</p>
            </div>
            <div className="space-y-1">
              <Label>Nom</Label>
              <p className="text-foreground py-2">{initialData.lastName}</p>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <p className="text-muted-foreground py-2">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <Label>Téléphone</Label>
              <p className="text-foreground py-2">
                {initialData.phone || 'Non renseigné'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-foreground text-lg">
            {vehiclePlates.length > 1 ? 'Plaques véhicules' : 'Plaque véhicule'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {initialData.vehiclePlates.length ? (
              initialData.vehiclePlates.map((plate, idx) => (
                <span key={idx} className="bg-muted px-2 py-1 rounded text-sm">
                  {plate}
                </span>
              ))
            ) : (
              <p className="text-foreground py-2">Non renseignée</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground text-lg">
          Informations de contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={user?.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-foreground text-lg">
          {vehiclePlates.length > 1 ? 'Plaques véhicules' : 'Plaque véhicule'}
        </h2>
        <div className="space-y-2">
          {vehiclePlates.map((plate, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                value={plate}
                onChange={(e) => updatePlate(idx, e.target.value)}
                error={errors[`plate_${idx}`]}
                className="flex-1"
                placeholder="ex: AB123CD"
              />
              {idx > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => removePlate(idx)}
                >
                  Supprimer
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addPlate}>
            + Ajouter une plaque
          </Button>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-border">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText="Enregistrement"
          className="flex-1"
        >
          Enregistrer
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
}