'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { Select } from '@/components/atoms/Select';
import { ChevronDown, ChevronUp, Filter, Info } from 'lucide-react';
import { getStore } from '@/lib/store';

interface FilterItem {
  value: string;
  label: string;
  state: 'neutral' | 'selected' | 'deselected';
}

interface FilterSectionProps {
  selectedCount: number;
  deselectedCount: number;
  sections: {
    label: string;
    items: FilterItem[];
    onItemClick: (value: string) => void;
  }[];
  onLocationChange: (locationId: string) => void;
  selectedLocation: string;
  onDateRangeChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  dateRange: { startDate: Date | null; endDate: Date | null };
}

export function FilterSection({
  selectedCount,
  deselectedCount,
  sections,
  onLocationChange,
  selectedLocation,
  onDateRangeChange,
  dateRange,
}: FilterSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const locations = getStore().getLocations();
  const locationOptions = locations.map(loc => ({ value: loc.id, label: loc.name }));

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Lieu:</span>
          <Select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            options={locationOptions}
            className="w-48"
          />
        </div>
        <div className="relative">
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="w-4 h-4" />
            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          {(selectedCount > 0 || deselectedCount > 0) && (
            <div className="absolute -top-2 -right-2 text-[10px] font-semibold bg-background rounded-full px-1.5 shadow-sm">
              <span className="text-green-600">+{selectedCount}</span>
              <span className="text-red-600"> -{deselectedCount}</span>
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sections.map(section => (
              <div key={section.label} className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">{section.label}</p>
                <div className="flex flex-wrap gap-2">
                  {section.items.map(item => (
                    <Badge
                      key={item.value}
                      variant={
                        item.state === 'selected' ? 'success' :
                        item.state === 'deselected' ? 'destructive' : 'default'
                      }
                    >
                      <button
                        onClick={() => section.onItemClick(item.value)}
                        className="text-xs cursor-pointer"
                      >
                        {item.label}
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Plage horaire</p>
              <DateRangePicker
                onChange={(range) => {
                  onDateRangeChange({
                    startDate: range.startDate,
                    endDate: range.endDate,
                  });
                }}
                value={{
                  startDate: dateRange.startDate,
                  endDate: dateRange.endDate,
                  startTime: '09:00',
                  endTime: '17:00',
                }}
              />
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Info className="w-3 h-3" />
                <span>Ce filtre affichera les listes des réservations à la place sélectionnez.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}