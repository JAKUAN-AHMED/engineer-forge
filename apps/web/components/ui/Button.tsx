'use client';

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantMap = {
  primary:
    'bg-primary text-background shadow-lg shadow-primary/20 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40',
  secondary:
    'border border-border bg-surface text-text-primary hover:border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/20',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary/20',
};

const sizeMap = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
      {...props}
    />
  );
}
