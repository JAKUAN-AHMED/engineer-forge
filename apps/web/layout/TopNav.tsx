'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 transition-colors">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-lg shadow-primary/30"
          >
            E
          </motion.div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-secondary">Engineer Forge</p>
            <p className="text-sm font-semibold text-text-primary">L1 Mastery</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Courses', href: '/courses' },
            { name: 'Practice', href: '/problem/intro' },
            { name: 'Profile', href: '/profile' }
          ].map((item) => (
            <Link key={item.name} href={item.href} className="relative px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary group">
              <span>{item.name}</span>
              <span className="absolute inset-x-0 -bottom-[18px] h-0.5 scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
