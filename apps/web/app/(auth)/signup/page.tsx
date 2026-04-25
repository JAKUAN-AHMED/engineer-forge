'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth, type AuthUser } from '@/lib/store';

export default function SignupPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { user, accessToken } = await api.post<{ user: AuthUser; accessToken: string }>(
        '/api/auth/signup',
        { name, email, password },
      );
      setSession(user, accessToken);
      router.push('/dashboard');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8 md:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 h-64 w-64 bg-gradient-to-br from-primary/20 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white shadow-xl shadow-primary/30">
            E
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-2">Create account</h1>
          <p className="mt-2 text-sm text-text-secondary font-medium">Join us and level up your engineering skills.</p>
        </div>

        <div className="relative z-10 space-y-6">
          <button 
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border-glass bg-surface/50 px-4 py-3 text-sm font-bold text-text-primary shadow-sm backdrop-blur-md transition-all hover:bg-surface hover:shadow-md hover:border-primary/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-glass"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface px-3 text-xs font-bold uppercase tracking-widest text-text-secondary">Or create account manually</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="w-full rounded-xl border border-border-glass bg-background px-4 py-3 text-sm font-medium text-text-primary shadow-inner placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Email address</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                required 
                className="w-full rounded-xl border border-border-glass bg-background px-4 py-3 text-sm font-medium text-text-primary shadow-inner placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Password (min 8)</label>
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                minLength={8}
                required 
                className="w-full rounded-xl border border-border-glass bg-background px-4 py-3 text-sm font-medium text-text-primary shadow-inner placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
              />
            </div>
            {err && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold text-error text-center">
                {err}
              </motion.p>
            )}
            <button 
              disabled={loading} 
              className="mt-4 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <div className="pt-2 text-center text-sm font-medium text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-secondary transition-colors font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
