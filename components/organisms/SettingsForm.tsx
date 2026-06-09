'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select } from '@/components/atoms/Select';

interface SettingsFormProps {
  initialSettings: {
    parkingName: string;
    totalLevels: number;
    openingHour: string;
    closingHour: string;
    maintenanceDay: string;
    contactEmail: string;
    phoneNumber: string;
  };
  onSubmit: (settings: any) => void | Promise<void>;
  onCancel: () => void;
  readonly?: boolean;
}

export function SettingsForm({
  initialSettings,
  onSubmit,
  onCancel,
  readonly = false,
}: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (readonly) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (readonly) return;
    setIsSaving(true);
    await onSubmit(settings);
    setIsSaving(false);
  };

  const levelOptions = Array.from({ length: 6 }, (_, i) => ({
    value: (i + 3).toString(),
    label: `${i + 3} niveaux`,
  }));

  const dayOptions = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((d) => ({
    value: d,
    label:
      d === 'Monday'
        ? 'Lundi'
        : d === 'Tuesday'
        ? 'Mardi'
        : d === 'Wednesday'
        ? 'Mercredi'
        : d === 'Thursday'
        ? 'Jeudi'
        : d === 'Friday'
        ? 'Vendredi'
        : d === 'Saturday'
        ? 'Samedi'
        : 'Dimanche',
  }));

  if (readonly) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Informations générales
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Nom du parking</Label>
              <p className="text-foreground py-2">{settings.parkingName}</p>
            </div>
            <div>
              <Label>Nombre de niveaux</Label>
              <p className="text-foreground py-2">
                {settings.totalLevels} niveaux
              </p>
            </div>
            <div>
              <Label>Email de contact</Label>
              <p className="text-foreground py-2">{settings.contactEmail}</p>
            </div>
            <div>
              <Label>Téléphone</Label>
              <p className="text-foreground py-2">{settings.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Horaires d'ouverture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ouverture</Label>
              <p className="text-foreground py-2">{settings.openingHour}</p>
            </div>
            <div>
              <Label>Fermeture</Label>
              <p className="text-foreground py-2">{settings.closingHour}</p>
            </div>
          </div>
          <div>
            <Label>Jour de maintenance</Label>
            <p className="text-foreground py-2">
              {dayOptions.find((d) => d.value === settings.maintenanceDay)
                ?.label || settings.maintenanceDay}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Informations générales
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="parkingName">Nom du parking</Label>
            <Input
              id="parkingName"
              name="parkingName"
              value={settings.parkingName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="totalLevels">Nombre de niveaux</Label>
            <Select
              id="totalLevels"
              name="totalLevels"
              value={settings.totalLevels.toString()}
              onChange={handleChange}
              options={levelOptions}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactEmail">Email de contact</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Téléphone</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={settings.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Horaires d'ouverture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="openingHour">Ouverture</Label>
            <Input
              id="openingHour"
              name="openingHour"
              type="time"
              value={settings.openingHour}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="closingHour">Fermeture</Label>
            <Input
              id="closingHour"
              name="closingHour"
              type="time"
              value={settings.closingHour}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="maintenanceDay">Jour de maintenance</Label>
          <Select
            id="maintenanceDay"
            name="maintenanceDay"
            value={settings.maintenanceDay}
            onChange={handleChange}
            options={dayOptions}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-border">
        <Button
          variant="primary"
          type="submit"
          isLoading={isSaving}
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