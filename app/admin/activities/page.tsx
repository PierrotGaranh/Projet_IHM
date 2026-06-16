'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { ActivityLog } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { ActivityItem } from '@/components/molecules/ActivityItem';
import { LogFilterSection } from '@/components/organisms/LogFilterSection';
import { FilterButtons } from '@/components/molecules/FilterButtons';
import Loading from './loading';

function ActivitiesPageContent() {
  const [allActivities, setAllActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string; email: string }[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'system' | 'user' | 'parking' | 'reservation'>('all');
  const [filters, setFilters] = useState<{
    search?: string;
    userId?: string;
    dateRange?: { startDate: Date | null; endDate: Date | null };
  }>({});

  useEffect(() => {
    const store = getStore();
    setAllActivities(store.getActivities());
    setUsers(store.getAllUsers().map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email })));
    setLoading(false);
  }, []);

  useEffect(() => {
    let base = [...allActivities];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      base = base.filter(log => log.message.toLowerCase().includes(s));
    }
    if (filters.userId) {
      base = base.filter(log => log.userId === filters.userId);
    }
    if (filters.dateRange) {
      const start = filters.dateRange.startDate;
      const end = filters.dateRange.endDate;
      base = base.filter(log => {
        const ts = new Date(log.timestamp);
        if (start && ts < start) return false;
        if (end && ts > end) return false;
        return true;
      });
    }
    let final = base;
    if (statusFilter !== 'all') {
      final = final.filter(log => log.type === statusFilter);
    }
    setFilteredActivities(final);
  }, [allActivities, filters, statusFilter]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as any);
  };

  const baseCounts = (() => {
    let base = [...allActivities];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      base = base.filter(log => log.message.toLowerCase().includes(s));
    }
    if (filters.userId) {
      base = base.filter(log => log.userId === filters.userId);
    }
    if (filters.dateRange) {
      const start = filters.dateRange.startDate;
      const end = filters.dateRange.endDate;
      base = base.filter(log => {
        const ts = new Date(log.timestamp);
        if (start && ts < start) return false;
        if (end && ts > end) return false;
        return true;
      });
    }
    return base;
  })();

  const statusOptions = [
    { value: 'all', label: `Toutes (${baseCounts.length})` },
    { value: 'system', label: `Système (${baseCounts.filter(l => l.type === 'system').length})` },
    { value: 'user', label: `Utilisateurs (${baseCounts.filter(l => l.type === 'user').length})` },
    { value: 'parking', label: `Parking (${baseCounts.filter(l => l.type === 'parking').length})` },
    { value: 'reservation', label: `Réservations (${baseCounts.filter(l => l.type === 'reservation').length})` },
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Toutes les activités</h1>
        <p className="text-sm text-muted-foreground">Historique complet des actions du système</p>
      </div>
      <LogFilterSection
        onFilterChange={handleFilterChange}
        users={users}
      />
      <FilterButtons
        options={statusOptions}
        value={statusFilter}
        onChange={handleStatusFilterChange}
      />
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filteredActivities.length} activité(s)</p>
        </div>
        <div className="space-y-1">
          {filteredActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune activité trouvée</p>
          ) : (
            filteredActivities.map((log) => <ActivityItem key={log.id} log={log} />)
          )}
        </div>
      </Card>
    </div>
  );
}

export default function ActivitiesPage() {
  return <Suspense fallback={<Loading />}><ActivitiesPageContent /></Suspense>;
}