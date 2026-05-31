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
    } else if (step === 2) {
      errors.password = validateField('password', formData.password);
    }
    setFieldErrors(errors);
    return Object.values(errors).every(e => !e);
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Stepper currentStep={step} totalSteps={3} labels={['Identité', 'Contact & véhicules', 'Sécurité']} />
      {step === 0 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1"><Label htmlFor="lastName" required>Nom</Label><Input id="lastName" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} error={fieldErrors.lastName} required autoFocus /></div>
          <div className="space-y-1"><Label htmlFor="firstName" required>Prénom</Label><Input id="firstName" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} error={fieldErrors.firstName} required /></div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1"><Label htmlFor="email" required>Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} error={fieldErrors.email} required /></div>
          <div className="space-y-1">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="grid grid-row">
              <Input id="phone" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} error={fieldErrors.phone} placeholder="ex: +33612345678" />
              <span className="text-primary text-xs">Format international recommandé</span>
            </div>
            
          </div>
          <div className="space-y-2">
            <Label>Plaques d'immatriculation</Label>
            {formData.vehiclePlates.map((plate: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-start">
                <Input value={plate} onChange={(e) => updatePlate(idx, e.target.value)} error={fieldErrors[`plate_${idx}`]} placeholder="ex: AB123CD" className="flex-1" />
                {idx > 0 && (<Button type="button" variant="ghost" onClick={() => removePlate(idx)} className="h-full p-1"><X className="w-4 h-4 text-red-500" /></Button>)}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addPlate}>+ Ajouter une plaque</Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <PasswordInput name="password" label="Mot de passe" value={formData.password} onChange={(e) => updateField('password', e.target.value)} error={fieldErrors.password} required placeholder="********" />
        </div>
      )}
      <div className="flex justify-between gap-4 pt-2">
        {step > 0 && <Button type="button" variant="secondary" onClick={prevStep} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Retour</Button>}
        {step < 2 ? (
          <Button variant="primary" type="button" onClick={nextStep} className="flex items-center gap-2 ml-auto">Suivant <ChevronRight className="w-4 h-4" /></Button>
        ) : (
          <Button variant="primary" type="submit" isLoading={isSubmitting} loadingText="Inscription" className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> S'inscrire</Button>
        )}
      </div>
    </form>
  );
}