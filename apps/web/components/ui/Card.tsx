import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('glass-card p-6 md:p-8 hover:border-primary/20 transition-colors', className)}>
      {children}
    </div>
  );
}
