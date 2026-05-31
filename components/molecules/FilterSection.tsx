'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface FilterItem {
  value: string;
  label: string;
  state: 'neutral' | 'selected' | 'deselected';
}

interface FilterSectionProps {
  title: string;
  selectedCount: number;
  deselectedCount: number;
  sections: {
    label: string;
    items: FilterItem[];
    onItemClick: (value: string) => void;
  }[];
}

export function FilterSection({ title, selectedCount, deselectedCount, sections }: FilterSectionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(Object.fromEntries(sections.map(s => [s.label, false])));

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const getBadgeVariant = (state: 'neutral' | 'selected' | 'deselected'): 'default' | 'success' | 'destructive' => {
    if (state === 'selected') return 'success';
    if (state === 'deselected') return 'destructive';
    return 'default';
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">
          {title}{' '}
          {(selectedCount > 0 || deselectedCount > 0) && (
            <span className="text-sm ml-2">
              <span className="text-green-600">{selectedCount !== 0 ? `+${selectedCount}` : ''}</span>
              <span className="text-red-600"> {deselectedCount !== 0 ? `-${deselectedCount}` : ''}</span>
            </span>
          )}
        </h3>
      </div>
      <div className="flex flex-wrap gap-4">
        {sections.map(section => (
          <div key={section.label} className="flex-1 min-w-[150px]">
            <Button variant="ghost" onClick={() => toggleSection(section.label)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-foreground py-1 border-b border-border"
            >
              <span>{section.label}</span>
              <ChevronUp className={`w-4 h-4 transition-transform ${openSections[section.label] ? '' : 'rotate-180'}`} />
            </Button>
            {openSections[section.label] && (
              <div className="flex flex-wrap gap-2 mt-2">
                {section.items.map(item => (
                  <Badge key={item.value} variant={getBadgeVariant(item.state)}>
                    <Button variant="ghost" onClick={() => section.onItemClick(item.value)}>{item.label}</Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}