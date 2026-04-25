import type { ReactNode } from 'react';

export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max -translate-x-1/2 rounded-2xl border border-border bg-surface px-3 py-2 text-xs text-text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {content}
      </span>
    </span>
  );
}
