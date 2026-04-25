import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/5', className)}>
      {children}
    </div>
  );
}
