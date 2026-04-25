'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-3 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="relative h-6 w-12 rounded-full bg-border p-0.5">
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="block h-5 w-5 rounded-full bg-primary"
          animate={{ x: isDark ? 0 : 22 }}
        />
      </div>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
