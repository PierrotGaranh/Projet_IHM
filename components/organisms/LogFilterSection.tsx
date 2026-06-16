'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { UserSearchSelect } from '@/components/molecules/UserSearchSelect';

interface LogFilterSectionProps {
  onFilterChange: (filters: {
    search?: string;
    userId?: string;
    dateRange?: { startDate: Date | null; endDate: Date | null };
  }) => void;
  users: { id: string; firstName: string; lastName: string; email: string }[];
  initialFilters?: {
    search?: string;
    userId?: string;
    dateRange?: { startDate: Date | null; endDate: Date | null };
  };
}

export function LogFilterSection({ onFilterChange, users, initialFilters = {} }: LogFilterSectionProps) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [userId, setUserId] = useState(initialFilters.userId || '');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }>({
    startDate: initialFilters.dateRange?.startDate || null,
    endDate: initialFilters.dateRange?.endDate || null,
    startTime: '09:00',
    endTime: '17:00',
  });

  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    const filters: any = {};
    if (search) filters.search = search;
    if (userId) filters.userId = userId;
    if (dateRange.startDate || dateRange.endDate) {
      filters.dateRange = { startDate: dateRange.startDate, endDate: dateRange.endDate };
    }
    onFilterChangeRef.current(filters);
  }, [search, userId, dateRange]);

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Recherche</Label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans les messages..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Utilisateur</Label>
            <UserSearchSelect
              users={users}
              value={userId}
              onChange={setUserId}
              placeholder="Tous les utilisateurs..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Période</Label>
            <DateRangePicker
              onChange={(range) => setDateRange({
                startDate: range.startDate,
                endDate: range.endDate,
                startTime: range.startTime,
                endTime: range.endTime,
              })}
              value={dateRange}
              placeholder="Sélectionner une période"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}