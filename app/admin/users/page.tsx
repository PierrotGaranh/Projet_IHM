'use client';

import { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { User } from '@/lib/types';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'users' | 'admins'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const store = getStore();
    const allUsers = store.getAllUsers();
    setUsers(allUsers);
  }, [refreshKey]);

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' ? true : 
      filter === 'users' ? user.role === 'user' : 
      user.role === 'admin';
    
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les comptes et les permissions des utilisateurs
        </p>
      </div>

      {/* Filters and Search */}
      <div className="card-base p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 space-y-2">
            <label className="label-base">Recherche</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, email..."
              className="input-base w-full"
            />
          </div>

          {/* Filter */}
          <div className="space-y-2">
            <label className="label-base">Type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input-base w-full sm:w-48"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="users">Utilisateurs réguliers</option>
              <option value="admins">Administrateurs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="card-base p-12 text-center space-y-4">
          <p className="text-2xl">👤</p>
          <p className="text-lg font-semibold text-foreground">Aucun utilisateur trouvé</p>
        </div>
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
                    <h3 className="font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Téléphone</p>
                  <p className="font-semibold text-foreground">{user.phone || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Immatriculation</p>
                  <p className="font-semibold text-foreground">{user.vehiclePlate || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Inscrit depuis</p>
                  <p className="font-semibold text-foreground">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">ID</p>
                  <p className="font-semibold text-foreground text-xs">{user.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total utilisateurs</p>
          <p className="text-3xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Utilisateurs réguliers</p>
          <p className="text-3xl font-bold text-secondary">
            {users.filter(u => u.role === 'user').length}
          </p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Administrateurs</p>
          <p className="text-3xl font-bold text-destructive">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
      </div>
    </div>
  );
}
