'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map(s => [s.label, false]))
  );

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const getBadgeClass = (state: 'neutral' | 'selected' | 'deselected') => {
    if (state === 'selected') return 'bg-green-500 text-white hover:bg-green-600';
    if (state === 'deselected') return 'bg-red-500 text-white hover:bg-red-600';
    return 'bg-muted text-foreground hover:bg-muted/80';
  };

  return (
    <div className="card-base p-4 space-y-3">
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
            <button
              onClick={() => toggleSection(section.label)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-foreground py-1 border-b border-border cursor-pointer"
            >
              <span>{section.label}</span>
              <ChevronUp className={`w-4 h-4 transition-transform ${openSections[section.label] ? '' : 'rotate-180'}`} />
            </button>
            {openSections[section.label] && (
              <div className="flex flex-wrap gap-2 mt-2">
                {section.items.map(item => (
                  <button
                    key={item.value}
                    onClick={() => section.onItemClick(item.value)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors cursor-pointer ${getBadgeClass(item.state)}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}