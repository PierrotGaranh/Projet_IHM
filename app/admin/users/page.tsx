'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { User } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { PasswordInput } from '@/components/password-input';
import Loading from './loading';
import { X } from 'lucide-react';

function UsersManagementPageContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'users' | 'admins'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    vehiclePlates: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchData = () => {
    const store = getStore();
    setUsers(store.getAllUsers());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  if (loading) return <Loading />;

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' ? true : filter === 'users' ? user.role === 'user' : user.role === 'admin';
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const validateField = (name: string, value: string): string => {
    const nameRegex = /^[A-Za-zÀ-ÿ\s-]{1,50}$/;
    if (name === 'firstName' || name === 'lastName') {
      if (!value) return 'Ce champ est requis';
      if (!nameRegex.test(value)) return 'Lettres, espaces ou tirets (max 50)';
    }
    if (name === 'email') {
      if (!value) return 'Email requis';
      if (!value.includes('@') || value.length > 100) return 'Email invalide';
    }
    if (name === 'password') {
      if (!value) return 'Mot de passe requis';
      if (value.length < 6 || value.length > 100) return '6 à 100 caractères';
    }
    if (name === 'phone' && value && !/^[\d+\s-]{10,20}$/.test(value)) {
      return 'Téléphone invalide (10-20 chiffres, +, -, espace)';
    }
    if (name.startsWith('plate') && value && !/^[A-Za-z0-9\s-]{1,15}$/.test(value)) {
      return 'Plaque invalide (lettres, chiffres, -, espace)';
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string, index?: number) => {
    if (field.startsWith('plate') && index !== undefined) {
      const newPlates = [...newUser.vehiclePlates];
      newPlates[index] = value;
      setNewUser({ ...newUser, vehiclePlates: newPlates });
      const error = validateField(`plate${index}`, value);
      setFieldErrors(prev => ({ ...prev, [`plate_${index}`]: error }));
    } else {
      setNewUser({ ...newUser, [field]: value });
      const error = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const addPlateField = () => {
    setNewUser({ ...newUser, vehiclePlates: [...newUser.vehiclePlates, ''] });
  };

  const removePlateField = (index: number) => {
    const newPlates = newUser.vehiclePlates.filter((_, i) => i !== index);
    setNewUser({ ...newUser, vehiclePlates: newPlates });
  };

  const handleAddUser = async () => {
    const errors: Record<string, string> = {};
    errors.firstName = validateField('firstName', newUser.firstName);
    errors.lastName = validateField('lastName', newUser.lastName);
    errors.email = validateField('email', newUser.email);
    errors.password = validateField('password', newUser.password);
    if (newUser.phone) errors.phone = validateField('phone', newUser.phone);
    newUser.vehiclePlates.forEach((plate, idx) => {
      if (plate) {
        const err = validateField(`plate${idx}`, plate);
        if (err) errors[`plate_${idx}`] = err;
      }
    });
    if (Object.values(errors).some(e => e)) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const store = getStore();
    const result = store.register(
      newUser.email,
      newUser.password,
      newUser.firstName,
      newUser.lastName,
      newUser.phone,
      newUser.vehiclePlates.filter(p => p.trim() !== '')
    );
    if (result.success) {
      toast({
        variant: 'success',
        title: 'Utilisateur créé',
        description: `${newUser.firstName} ${newUser.lastName} a été ajouté.`,
      });
      setRefreshKey(prev => prev + 1);
      setShowAddModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', phone: '', password: '', vehiclePlates: [''] });
      setFieldErrors({});
    } else {
      setFieldErrors({ global: result.error || 'Erreur lors de la création' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les comptes et les permissions des utilisateurs</p>
      </div>

      <div className="card-base p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="label-base">Recherche</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Nom, email..."
              className="input-base w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="label-base">Type</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
              className="input-base w-full cursor-pointer sm:w-48"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="users">Utilisateurs réguliers</option>
              <option value="admins">Administrateurs</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => setShowAddModal(true)} className="btn-primary cursor-pointer">
              + Ajouter un utilisateur
            </button>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="card-base p-12 text-center">Aucun utilisateur trouvé</div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="card-base p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start sm:self-center ${user.role === 'admin' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'}`}>
                  {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
                <div className="break-words">
                  <p className="text-muted-foreground text-xs">Téléphone</p>
                  <p className="font-semibold">{user.phone || 'N/A'}</p>
                </div>
                <div className="break-words">
                  <p className="text-muted-foreground text-xs">Immatriculations</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.vehiclePlates.length ? (
                      user.vehiclePlates.map((plate, idx) => (
                        <span key={idx} className="inline-block bg-muted px-1.5 py-0.5 rounded text-xs break-all">{plate}</span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Aucune</span>
                    )}
                  </div>
                </div>
                <div className="break-words">
                  <p className="text-muted-foreground text-xs">Inscrit depuis</p>
                  <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card rounded-lg max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground">Ajouter un utilisateur</h2>
            {fieldErrors.global && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded" role="alert">{fieldErrors.global}</div>}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="label-base">Prénom <span className="text-destructive">*</span></label>
                <input type="text" value={newUser.firstName} onChange={e => handleFieldChange('firstName', e.target.value.slice(0, 50))} placeholder="ex: Jean" className={`input-base w-full ${fieldErrors.firstName ? 'border-destructive' : ''}`} />
                {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <label className="label-base">Nom <span className="text-destructive">*</span></label>
                <input type="text" value={newUser.lastName} onChange={e => handleFieldChange('lastName', e.target.value.slice(0, 50))} placeholder="ex: Dupont" className={`input-base w-full ${fieldErrors.lastName ? 'border-destructive' : ''}`} />
                {fieldErrors.lastName && <p className="text-xs text-destructive">{fieldErrors.lastName}</p>}
              </div>
              <div className="space-y-1">
                <label className="label-base">Email <span className="text-destructive">*</span></label>
                <input type="email" value={newUser.email} onChange={e => handleFieldChange('email', e.target.value.slice(0, 100))} placeholder="ex: jean.dupont@email.com" className={`input-base w-full ${fieldErrors.email ? 'border-destructive' : ''}`} />
                {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
              </div>
              <div className="space-y-1">
                <label className="label-base">Téléphone</label>
                <input type="tel" value={newUser.phone} onChange={e => handleFieldChange('phone', e.target.value.slice(0, 20))} placeholder="ex: +33612345678" className={`input-base w-full ${fieldErrors.phone ? 'border-destructive' : ''}`} />
                {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
              </div>
              <PasswordInput
                name="password"
                label="Mot de passe"
                value={newUser.password}
                onChange={(e) => handleFieldChange('password', e.target.value.slice(0, 100))}
                error={fieldErrors.password}
                required
                placeholder="********"
                maxLength={100}
              />
              <div className="space-y-2">
                <label className="label-base">Plaques d'immatriculation</label>
                {newUser.vehiclePlates.map((plate, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input type="text" value={plate} onChange={e => handleFieldChange(`plate${idx}`, e.target.value.slice(0, 15), idx)} placeholder="ex: AB-123-CD" className={`input-base w-full ${fieldErrors[`plate_${idx}`] ? 'border-destructive' : ''}`} />
                      {fieldErrors[`plate_${idx}`] && <p className="text-xs text-destructive">{fieldErrors[`plate_${idx}`]}</p>}
                    </div>
                    {idx > 0 && <button type="button" onClick={() => removePlateField(idx)} className="text-destructive hover:text-destructive/80 mt-1"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
                <button type="button" onClick={addPlateField} className="text-sm text-primary hover:underline">+ Ajouter une plaque</button>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={handleAddUser} disabled={isSubmitting} className="btn-primary flex-1 cursor-pointer">{isSubmitting ? <LoadingDots /> : 'Créer'}</button>
              <button onClick={() => { setShowAddModal(false); setFieldErrors({}); setNewUser({ firstName: '', lastName: '', email: '', phone: '', password: '', vehiclePlates: [''] }); }} className="btn-secondary flex-1 cursor-pointer">Annuler</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-base p-6"><p className="text-sm text-muted-foreground">Total utilisateurs</p><p className="text-3xl font-bold text-primary">{users.length}</p></div>
        <div className="card-base p-6"><p className="text-sm text-muted-foreground">Utilisateurs réguliers</p><p className="text-3xl font-bold text-secondary">{users.filter(u => u.role === 'user').length}</p></div>
        <div className="card-base p-6"><p className="text-sm text-muted-foreground">Administrateurs</p><p className="text-3xl font-bold text-destructive">{users.filter(u => u.role === 'admin').length}</p></div>
      </div>
    </div>
  );
}

export default function UsersManagementPage() {
  return <Suspense fallback={<Loading />}><UsersManagementPageContent /></Suspense>;
}