'use client';

export function OutputConsole({ output }: { output: string }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5 shadow-lg shadow-black/5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.24em] text-secondary">Output</p>
        <span className="text-xs text-text-secondary">Preview</span>
      </div>
      <pre className="min-h-[160px] overflow-x-auto rounded-3xl bg-surface px-4 py-4 text-sm text-text-secondary">
        {output}
      </pre>
    </div>
  );
}
