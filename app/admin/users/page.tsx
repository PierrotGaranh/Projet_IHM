'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { getStore } from '@/lib/store';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/atoms/Card';
import { AddUserForm } from '@/components/organisms/AddUserForm';
import { UserCard } from '@/components/molecules/UserCard';
import { FiltersBar } from '@/components/organisms/FiltersBar';
import { Pagination } from '@/components/molecules/Pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import Loading from './loading';

function UsersManagementPageContent() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'users' | 'admins'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const listRef = useRef<HTMLDivElement>(null);
  const smoothScrollToElement = (el: HTMLElement, offset = 80) => { const pos = el.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: pos - offset, behavior: 'smooth' }); };
  const fetchData = () => { const store = getStore(); setUsers(store.getAllUsers()); setLoading(false); };

  useEffect(() => { fetchData(); }, [refreshKey]);
  useEffect(() => { setCurrentPage(1); }, [filter, searchTerm]);
  useEffect(() => { if (listRef.current) smoothScrollToElement(listRef.current); }, [currentPage]);

  const filtered = users.filter(u => (filter === 'all' ? true : filter === 'users' ? u.role === 'user' : u.role === 'admin') 
  && (u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) 
  || u.email.toLowerCase().includes(searchTerm.toLowerCase())));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIdx, startIdx + itemsPerPage);
  const goToPage = (p: number) => { if (p >= 1 && p <= totalPages) setCurrentPage(p); };
  const filterOptions = [
    { value: 'all', label: `Tous les utilisateurs (${users.length})` },
    { value: 'users', label: `Utilisateurs réguliers (${users.filter(u => u.role === 'user').length})` },
    { value: 'admins', label: `Administrateurs (${users.filter(u => u.role === 'admin').length})` }
  ];

  if (loading) return <Loading />;
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1 sm:space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>Gestion des utilisateurs</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>Gérez les comptes et les permissions des utilisateurs</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        <FiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Nom, email..."
          filterLabel="Type"
          filterOptions={filterOptions}
          filterValue={filter}
          onFilterChange={(v) => setFilter(v as any)}
          addButtonLabel="+ Ajouter un utilisateur"
          onAddClick={() => setShowAddModal(true)}
        />
      </Card>
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">Aucun utilisateur trouvé</Card>
      ) : (
        <>
          <div ref={listRef} className="space-y-4">
            {displayed.map(user => <UserCard key={user.id} user={user} />)}
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
        </>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card rounded-lg max-w-md w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">Ajouter un utilisateur</h2>
            <AddUserForm
              onSubmit={async (data) => {
                const store = getStore();
                const result = store.register(data.email, data.password, data.firstName, data.lastName, data.phone, data.vehiclePlates.filter((p: string) => p.trim() !== ''));
                if (result.success) {
                  toast({ variant: 'success', title: 'Utilisateur créé', description: `${data.firstName} ${data.lastName} a été ajouté.` });
                  setRefreshKey(prev => prev + 1);
                  setShowAddModal(false);
                } else {
                  throw new Error(result.error || 'Erreur lors de la création');
                }
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default function UsersManagementPage() { return <Suspense fallback={<Loading />}><UsersManagementPageContent /></Suspense>; }