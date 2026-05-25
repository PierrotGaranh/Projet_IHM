'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { User } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import Loading from './loading';

function UsersManagementPageContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'users' | 'admins'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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

  const handleAddUser = async () => {
    setFormError('');
    // Validation
    const nameRegex = /^[A-Za-zÀ-ÿ\s-]{1,50}$/;
    if (!nameRegex.test(newUser.firstName)) {
      setFormError('Le prénom ne doit contenir que des lettres, espaces ou tirets (max 50 caractères)');
      return;
    }
    if (!nameRegex.test(newUser.lastName)) {
      setFormError('Le nom ne doit contenir que des lettres, espaces ou tirets (max 50 caractères)');
      return;
    }
    if (!newUser.email || !newUser.email.includes('@') || newUser.email.length > 100) {
      setFormError('Email invalide (max 100 caractères)');
      return;
    }
    if (newUser.password.length < 6 || newUser.password.length > 100) {
      setFormError('Le mot de passe doit contenir entre 6 et 100 caractères');
      return;
    }
    if (newUser.phone && !/^[\d+\s-]{10,20}$/.test(newUser.phone)) {
      setFormError('Téléphone invalide (10 à 20 chiffres, espaces, +, -)');
      return;
    }

    setIsSubmitting(true);
    const store = getStore();
    const result = store.register(newUser.email, newUser.password, newUser.firstName, newUser.lastName, newUser.phone);
    if (result.success) {
      toast({ variant: 'success', title: 'Utilisateur créé', description: `L'utilisateur ${newUser.firstName} ${newUser.lastName} a été ajouté.` });
      setRefreshKey(prev => prev + 1);
      setShowAddModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    } else {
      setFormError(result.error || 'Erreur lors de la création');
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
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nom, email..." className="input-base w-full" />
          </div>
          <div className="space-y-2">
            <label className="label-base">Type</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="input-base w-full sm:w-48">
              <option value="all">Tous les utilisateurs</option>
              <option value="users">Utilisateurs réguliers</option>
              <option value="admins">Administrateurs</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => setShowAddModal(true)} className="btn-primary cursor-pointer">+ Ajouter un utilisateur</button>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="card-base p-12 text-center">Aucun utilisateur trouvé</div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="card-base p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'}`}>
                  {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
                <div><p className="text-muted-foreground text-xs">Téléphone</p><p className="font-semibold">{user.phone || 'N/A'}</p></div>
                <div><p className="text-muted-foreground text-xs">Immatriculation</p><p className="font-semibold">{user.vehiclePlate || 'N/A'}</p></div>
                <div><p className="text-muted-foreground text-xs">Inscrit depuis</p><p className="font-semibold">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Ajouter un utilisateur</h2>
            {formError && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded" role="alert">{formError}</div>}
            <div className="space-y-3">
              <input type="text" placeholder="Prénom *" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value.slice(0,50) })} className="input-base w-full" />
              <input type="text" placeholder="Nom *" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value.slice(0,50) })} className="input-base w-full" />
              <input type="email" placeholder="Email *" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value.slice(0,100) })} className="input-base w-full" />
              <input type="tel" placeholder="Téléphone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value.slice(0,20) })} className="input-base w-full" />
              <input type="password" placeholder="Mot de passe *" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value.slice(0,100) })} className="input-base w-full" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={handleAddUser} disabled={isSubmitting} className="btn-primary flex-1 cursor-pointer">
                {isSubmitting ? <LoadingDots /> : 'Créer'}
              </button>
              <button onClick={() => { setShowAddModal(false); setFormError(''); }} className="btn-secondary flex-1 cursor-pointer">Annuler</button>
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

export default function UsersManagementPage() {return <Suspense fallback={<Loading />}><UsersManagementPageContent /></Suspense>};