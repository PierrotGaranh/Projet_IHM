'use client';

import { useState } from 'react';
import { List } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';

interface VehiclePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  label?: string;
  placeholder?: string;
  error?: string;
}

export function VehiclePlateInput({ value, onChange, options = [], label, placeholder = "ex: AB123CD", error }: VehiclePlateInputProps) {
  const [isManual, setIsManual] = useState(!options.includes(value) && value !== '');

  const selectOptions = [
    { value: '', label: 'Sélectionnez une plaque' },
    ...options.map(plate => ({ value: plate, label: plate })),
    { value: 'other', label: 'Autre (saisir manuellement)' }
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'other') {
      setIsManual(true);
      onChange('');
    } else {
      setIsManual(false);
      onChange(val);
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      {!isManual ? (
        <Select value={value} onChange={handleSelectChange} options={selectOptions} error={error} />
      ) : (
        <div className="flex gap-2">
          <Input value={value} onChange={(e) => onChange(e.target.value.slice(0, 15))} placeholder={placeholder} error={error} className="flex-1" />
          <Button type="button" variant="secondary" onClick={() => { setIsManual(false); onChange(''); }} aria-label="Retour à la sélection">
            <List className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}