'use client';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select } from '@/components/atoms/Select';

interface FiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions: { value: string; label: string }[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  addButtonLabel: string;
  onAddClick: () => void;
}

export function FiltersBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filterLabel = "Filtre",
  filterOptions,
  filterValue,
  onFilterChange,
  addButtonLabel,
  onAddClick,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 space-y-2">
        <Label>Recherche</Label>
        <Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} />
      </div>
      <div className="space-y-2">
        <Label>{filterLabel}</Label>
        <Select value={filterValue} onChange={(e) => onFilterChange(e.target.value)} options={filterOptions} className="sm:w-56" />
      </div>
      <div className="flex items-end">
        <button
          type="button"
          onClick={onAddClick}
          className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}