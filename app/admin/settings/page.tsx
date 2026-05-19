'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    parkingName: 'ParkHub Central',
    totalLevels: 5,
    openingHour: '06:00',
    closingHour: '23:00',
    maintenanceDay: 'Monday',
    contactEmail: 'admin@parkhub.com',
    phoneNumber: '+33612345678',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 500));

    setMessage('Paramètres sauvegardés avec succès!');
    setIsSaving(false);

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">
          Configuration générale du système de parking
        </p>
      </div>

      {/* Settings Form */}
      <div className="card-base p-8 space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Informations générales</h2>

          <div className="space-y-4">
            {/* Parking Name */}
            <div className="space-y-2">
              <label className="label-base">Nom du parking</label>
              <input
                type="text"
                name="parkingName"
                value={settings.parkingName}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>

            {/* Total Levels */}
            <div className="space-y-2">
              <label className="label-base">Nombre de niveaux</label>
              <select
                name="totalLevels"
                value={settings.totalLevels}
                onChange={handleChange}
                className="input-base w-full"
              >
                {[3, 4, 5, 6, 7, 8].map(level => (
                  <option key={level} value={level}>{level} niveaux</option>
                ))}
              </select>
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <label className="label-base">Email de contact</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="label-base">Téléphone</label>
              <input
                type="tel"
                name="phoneNumber"
                value={settings.phoneNumber}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="pt-6 border-t border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Horaires d'ouverture</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opening Hour */}
            <div className="space-y-2">
              <label className="label-base">Ouverture</label>
              <input
                type="time"
                name="openingHour"
                value={settings.openingHour}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>

            {/* Closing Hour */}
            <div className="space-y-2">
              <label className="label-base">Fermeture</label>
              <input
                type="time"
                name="closingHour"
                value={settings.closingHour}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
          </div>

          {/* Maintenance Day */}
          <div className="space-y-2">
            <label className="label-base">Jour de maintenance</label>
            <select
              name="maintenanceDay"
              value={settings.maintenanceDay}
              onChange={handleChange}
              className="input-base w-full"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>
                  {day === 'Monday' ? 'Lundi' :
                   day === 'Tuesday' ? 'Mardi' :
                   day === 'Wednesday' ? 'Mercredi' :
                   day === 'Thursday' ? 'Jeudi' :
                   day === 'Friday' ? 'Vendredi' :
                   day === 'Saturday' ? 'Samedi' : 'Dimanche'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-6 border-t border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tarification (à titre informatif)</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Place Compact</span>
              <span className="font-semibold text-foreground">2€/heure</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Place Standard</span>
              <span className="font-semibold text-foreground">3€/heure</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Place Premium</span>
              <span className="font-semibold text-foreground">5€/heure</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 text-sm text-secondary">
            {message}
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary w-full cursor-pointer disabled:cursor-not-allowed disabled:bg-secondary/50 disabled:text-secondary/70"
          >
            {isSaving ? 'Sauvegarde en cours...' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Informations système</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Version de l'application</span>
            <span className="font-semibold text-foreground">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-muted-foreground">Dernière mise à jour</span>
            <span className="font-semibold text-foreground">
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-muted-foreground">Statut du système</span>
            <span className="inline-flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-semibold text-secondary">En ligne</span>
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-base p-6 border-l-4 border-l-destructive bg-destructive/5 space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Zone dangereuse</h2>
        <p className="text-sm text-muted-foreground">
          Ces actions sont irréversibles. Procédez avec prudence.
        </p>
        <button className="btn-secondary text-sm border-destructive text-destructive hover:bg-destructive/10 w-full">
          Réinitialiser les données de démonstration
        </button>
      </div>
    </div>
  );
}
