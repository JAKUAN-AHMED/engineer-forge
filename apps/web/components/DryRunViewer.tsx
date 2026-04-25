'use client';
import { useState } from 'react';
import type { DryRunStep } from '@forge/shared';

export function DryRunViewer({ steps }: { steps: DryRunStep[] }) {
  const [i, setI] = useState(0);
  if (!steps || steps.length === 0) return null;
  const step = steps[Math.min(i, steps.length - 1)];

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-ink-800 bg-ink-900">
        <div className="text-xs uppercase tracking-wide text-ink-400 font-semibold">
          Step {i + 1} / {steps.length}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} className="text-xs px-3 py-1 rounded border border-ink-700 disabled:opacity-40">
            ← Prev
          </button>
          <button onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i === steps.length - 1} className="text-xs px-3 py-1 rounded bg-brand-500 text-ink-950 font-semibold disabled:opacity-40">
            Next →
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 divide-ink-800 md:divide-x">
        <div className="p-4">
          <div className="text-xs text-ink-400 uppercase tracking-wide mb-2">Executing</div>
          <pre className="text-sm">{step.code}</pre>
          <p className="text-sm text-ink-300 mt-3 leading-relaxed">{step.explanation}</p>
        </div>
        <div className="p-4 space-y-3">
          <Queue label="Call Stack (LIFO)" items={step.callStack ?? []} color="brand" />
          <Queue label="Microtask Queue" items={step.microtaskQueue ?? []} color="green" />
          <Queue label="Macrotask Queue" items={step.macrotaskQueue ?? []} color="yellow" />
        </div>
      </div>
    </div>
  );
}

function Queue({ label, items, color }: { label: string; items: string[]; color: 'brand' | 'green' | 'yellow' }) {
  const colors = {
    brand: 'border-brand-500/50 bg-brand-500/10 text-brand-100',
    green: 'border-green-500/50 bg-green-500/10 text-green-100',
    yellow: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-100',
  } as const;
  return (
    <div>
      <div className="text-xs text-ink-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="flex flex-wrap gap-1 min-h-[2rem] p-2 rounded border border-ink-800 bg-ink-950">
        {items.length === 0 && <span className="text-ink-500 text-xs italic">empty</span>}
        {items.map((it, idx) => (
          <span key={idx} className={`text-xs font-mono px-2 py-1 rounded border ${colors[color]}`}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
