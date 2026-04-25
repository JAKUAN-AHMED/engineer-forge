'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const sections = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Courses', href: '/courses' },
  { label: 'Practice', href: '/problem/intro' },
  { label: 'Profile', href: '/profile' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="glass-card mb-6 p-5">
        <div className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-secondary">Quick access</div>
        <div className="space-y-2 relative">
          {sections.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                  isActive ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-5 group">
        <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-secondary">Study tips</div>
        <ul className="space-y-4 text-sm text-text-secondary">
          <li className="flex gap-3 items-start transition-colors group-hover:text-text-primary">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-success shrink-0 shadow-[0_0_8px_var(--success)]" />
            <span>Break lessons into 25-minute focus blocks.</span>
          </li>
          <li className="flex gap-3 items-start transition-colors group-hover:text-text-primary">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0 shadow-[0_0_8px_var(--secondary)]" />
            <span>Use the interactive sandbox to validate logic.</span>
          </li>
          <li className="flex gap-3 items-start transition-colors group-hover:text-text-primary">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-warning shrink-0 shadow-[0_0_8px_var(--warning)]" />
            <span>Review weak topics weekly.</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
