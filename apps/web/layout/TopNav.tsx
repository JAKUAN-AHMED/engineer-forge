'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/store';

export function TopNav() {
  const { user, clear } = useAuth();
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 border-b border-border-glass bg-background/80 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 transition-colors">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-lg shadow-primary/30"
          >
            E
          </motion.div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-secondary">Engineer Forge</p>
            <p className="text-sm font-extrabold text-text-primary">L1 Mastery</p>
          </div>
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 lg:flex flex-1 justify-center ml-8">
            {[
              { name: 'Dashboard', href: '/dashboard' },
              { name: 'Courses', href: '/courses' },
              { name: 'Practice', href: '/problem/intro' },
              { name: 'Profile', href: '/profile' }
            ].map((item) => (
              <Link key={item.name} href={item.href} className="relative px-5 py-2 text-sm font-bold text-text-secondary transition-colors hover:text-primary group">
                <span>{item.name}</span>
                <span className="absolute inset-x-0 -bottom-[20px] h-0.5 scale-x-0 rounded-t-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            ))}
          </nav>
        )}

        {/* If no user, mock a flex-1 span so right side stays identical */}
        {!user && <div className="hidden lg:block flex-1" />}

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="hidden md:flex items-center gap-4 mr-2">
              {pathname === '/login' ? (
                <Link href="/signup" className="rounded-[12px] bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90 flex items-center shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">Sign up</Link>
              ) : (
                <Link href="/login" className="rounded-[12px] bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90 flex items-center shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">Sign in</Link>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 mr-2">
              <Link href="/profile" className="flex items-center gap-2.5 border border-border-glass rounded-full pr-4 pl-1.5 py-1.5 bg-surface/50 hover:bg-surface hover:shadow-md transition-all group">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-white text-xs font-bold shadow-inner ring-2 ring-primary/20 group-hover:ring-primary transition-all">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{user.name.split(' ')[0]}</span>
              </Link>
              
              <button 
                onClick={clear}
                className="ml-1 rounded-full p-2.5 text-text-secondary hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                title="Sign out"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
