'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function CodePanel({ initialCode = '' }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-lg shadow-black/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Code editor</p>
          <h3 className="text-lg font-semibold text-text-primary">Live sandbox</h3>
        </div>
        <Button size="sm" variant="secondary">
          Run
        </Button>
      </div>
      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        className="min-h-[240px] w-full resize-none rounded-3xl border border-border bg-background px-4 py-4 text-sm leading-6 text-text-primary transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
