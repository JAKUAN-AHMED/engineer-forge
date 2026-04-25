import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TabsProps {
  tabs: Array<{ key: string; label: string }>;
  activeTab: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-border bg-surface/70 p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition',
            activeTab === tab.key
              ? 'bg-primary text-background shadow-sm shadow-primary/30'
              : 'text-text-secondary hover:bg-surface',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
