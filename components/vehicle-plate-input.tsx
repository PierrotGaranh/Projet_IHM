'use client';

import { useState } from 'react';
import { List } from 'lucide-react';

interface VehiclePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  label?: string;
  placeholder?: string;
}

export function VehiclePlateInput({
  value,
  onChange,
  options = [],
  label,
  placeholder = "ex: AB123CD",
}: VehiclePlateInputProps) {
  const [isManual, setIsManual] = useState(!options.includes(value) && value !== '');

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
      {label && <label className="label-base">{label}</label>}
      {!isManual ? (
        <select
          value={value}
          onChange={handleSelectChange}
          className="input-base w-full"
        >
          <option value="">Sélectionnez une plaque</option>
          {options.map((plate, idx) => (
            <option key={idx} value={plate}>{plate}</option>
          ))}
          <option value="other">Autre (saisir manuellement)</option>
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, 15))}
            placeholder={placeholder}
            className="input-base w-full"
          />
          <button
            type="button"
            onClick={() => {
              setIsManual(false);
              onChange('');
            }}
            className="btn-secondary px-3 py-2 cursor-pointer"
            aria-label="Retour à la sélection"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}