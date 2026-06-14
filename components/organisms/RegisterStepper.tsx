'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { Stepper } from '@/components/molecules/Stepper';
import { validateField } from '@/lib/validation';
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';

interface RegisterStepperProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export function RegisterStepper({ onSubmit, initialData }: RegisterStepperProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData || { firstName: '', lastName: '', email: '', phone: '', password: '', vehiclePlates: [''] });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updatePlate = (idx: number, value: string) => {
    const newPlates = [...formData.vehiclePlates];
    newPlates[idx] = value;
    setFormData((prev: { vehiclePlates: string[]; }) => ({ ...prev, vehiclePlates: newPlates }));
    setFieldErrors(prev => ({ ...prev, [`plate_${idx}`]: '' }));
  };

  const addPlate = () => setFormData((prev: { vehiclePlates: string[]; }) => ({ ...prev, vehiclePlates: [...prev.vehiclePlates, ''] }));
  const removePlate = (idx: number) => setFormData((prev: { vehiclePlates: string[]; }) => ({ ...prev, vehiclePlates: prev.vehiclePlates.filter((_: string, i: number) => i !== idx) }));

  const isStepValid = () => {
    if (step === 0) {
      const firstNameOk = formData.firstName.trim() !== '' && !validateField('firstName', formData.firstName);
      const lastNameOk = formData.lastName.trim() !== '' && !validateField('lastName', formData.lastName);
      return firstNameOk && lastNameOk;
    }
    if (step === 1) {
      const emailOk = formData.email.trim() !== '' && !validateField('email', formData.email);
      const phoneOk = formData.phone === '' || !validateField('phone', formData.phone);
      const platesOk = formData.vehiclePlates.every((plate: string) => plate === '' || !validateField('plate', plate));
      return emailOk && phoneOk && platesOk;
    }
    if (step === 2) {
      const passwordOk = formData.password.trim() !== '' && !validateField('password', formData.password);
      return passwordOk;
    }
    return false;
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    if (step === 0) {
      errors.firstName = validateField('firstName', formData.firstName);
      errors.lastName = validateField('lastName', formData.lastName);
    } else if (step === 1) {
      errors.email = validateField('email', formData.email);
      if (formData.phone) errors.phone = validateField('phone', formData.phone);
      formData.vehiclePlates.forEach((plate: string, idx: number) => {
        if (plate) errors[`plate_${idx}`] = validateField('plate', plate);
      });
    }
    setFieldErrors(errors);
    return Object.values(errors).every(e => !e);
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) return nextStep();

    const errors: Record<string, string> = {};
    errors.firstName = validateField('firstName', formData.firstName);
    errors.lastName = validateField('lastName', formData.lastName);
    errors.email = validateField('email', formData.email);
    errors.password = validateField('password', formData.password);
    if (formData.phone) errors.phone = validateField('phone', formData.phone);
    formData.vehiclePlates.forEach((plate: string, idx: number) => {
      if (plate) errors[`plate_${idx}`] = validateField('plate', plate);
    });
    setFieldErrors(errors);
    if (Object.values(errors).some(e => e)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasBackButton = step > 0;
  const hasNextButton = step < 2;
  const submitButton = step === 2;
  const buttonCount = (hasBackButton ? 1 : 0) + (hasNextButton ? 1 : 0) + (submitButton ? 1 : 0);
  const isSingleButton = buttonCount === 1;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Stepper currentStep={step} totalSteps={3} labels={['Identité', 'Contact & véhicules', 'Sécurité']} />

      {step === 0 && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="space-y-1">
            <Label htmlFor="lastName" showRequired>Nom</Label>
            <Input id="lastName" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} error={fieldErrors.lastName} required autoFocus />
          </div>
          <div className="space-y-1">
            <Label htmlFor="firstName" showRequired>Prénom</Label>
            <Input id="firstName" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} error={fieldErrors.firstName} required />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="space-y-1">
            <Label htmlFor="email" showRequired>Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} error={fieldErrors.email} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} error={fieldErrors.phone} placeholder="ex: +33612345678" />
          </div>
          <div className="space-y-2">
            <Label>Plaques d'immatriculation</Label>
            {formData.vehiclePlates.map((plate: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-start">
                <Input value={plate} onChange={(e) => updatePlate(idx, e.target.value)} error={fieldErrors[`plate_${idx}`]} placeholder="ex: AB123CD" className="flex-1" />
                {idx > 0 && (
                  <Button type="button" variant="ghost" onClick={() => removePlate(idx)} className="h-full p-1">
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addPlate} className="w-full sm:w-auto">+ Ajouter une plaque</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <PasswordInput name="password" label="Mot de passe" value={formData.password} onChange={(e) => updateField('password', e.target.value)} error={fieldErrors.password} showRequired placeholder="********" />
        </div>
      )}

      <div className={`flex flex-row gap-2 ${isSingleButton ? 'justify-center' : 'justify-between'}`}>
        {hasBackButton && (
          <Button type="button" variant="secondary" onClick={prevStep} className={`${isSingleButton ? 'w-auto' : 'flex-1 sm:flex-initial'} flex items-center justify-center gap-2`}>
            <ChevronLeft className="w-4 h-4" /> Retour
          </Button>
        )}
        {hasNextButton && (
          <Button
            type="button"
            variant="primary"
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`${isSingleButton ? 'w-auto' : 'flex-1 sm:flex-initial'} flex items-center justify-center gap-2`}
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        {submitButton && (
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Inscription"
            disabled={!isStepValid()}
            className={`${isSingleButton ? 'w-auto' : 'flex-1 sm:flex-initial'} flex items-center justify-center gap-2`}
          >
            <CheckCircle className="w-4 h-4" /> S'inscrire
          </Button>
        )}
      </div>
    </form>
  );
}