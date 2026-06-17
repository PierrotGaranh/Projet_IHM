'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { validateField } from '@/lib/validation';
import { X } from 'lucide-react';

const STORAGE_KEY = 'addUserForm';

interface AddUserFormProps {
  onSubmit: (userData: any) => Promise<void>;
  onCancel: () => void;
}

export function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    vehiclePlates: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const { password, ...dataToSave } = formData;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updatePlate = (idx: number, value: string) => {
    const newPlates = [...formData.vehiclePlates];
    newPlates[idx] = value;
    setFormData((prev) => ({ ...prev, vehiclePlates: newPlates }));
    setErrors((prev) => ({ ...prev, [`plate_${idx}`]: '' }));
  };

  const addPlate = () =>
    setFormData((prev) => ({ ...prev, vehiclePlates: [...prev.vehiclePlates, ''] }));
  const removePlate = (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      vehiclePlates: prev.vehiclePlates.filter((_, i) => i !== idx),
    }));

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    newErrors.firstName = validateField('firstName', formData.firstName);
    newErrors.lastName = validateField('lastName', formData.lastName);
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    if (formData.phone) newErrors.phone = validateField('phone', formData.phone);
    formData.vehiclePlates.forEach((plate, idx) => {
      if (plate) newErrors[`plate_${idx}`] = validateField('plate', plate);
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="firstName" showRequired>
          Prénom
        </Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          error={errors.firstName}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="lastName" showRequired>
          Nom
        </Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          error={errors.lastName}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" showRequired>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
        />
      </div>
      <PasswordInput
        name="password"
        label="Mot de passe"
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        error={errors.password}
        showRequired
      />
      <div className="space-y-2">
        <Label>Plaques d'immatriculation</Label>
        {formData.vehiclePlates.map((plate, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <Input
              value={plate}
              onChange={(e) => updatePlate(idx, e.target.value)}
              error={errors[`plate_${idx}`]}
              placeholder="ex: AB123CD"
              className="flex-1"
            />
            {idx > 0 && (
              <Button type="button" variant="secondary" onClick={() => removePlate(idx)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addPlate}>
          + Ajouter une plaque
        </Button>
      </div>
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText="Enregistrement"
          className="flex-1"
        >
          Créer
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
}