'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, type AuthUser } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const [email, setEmail] = useState('student@forge.dev');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { user, accessToken } = await api.post<{ user: AuthUser; accessToken: string }>(
        '/api/auth/login',
        { email, password },
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
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-white mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input" />
        </Field>
        <Field label="Password">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="input" />
        </Field>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={loading} className="w-full py-2.5 rounded-lg bg-brand-500 text-ink-950 font-semibold hover:bg-brand-400 disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-ink-400 mt-4">
        New here? <Link href="/signup">Create an account</Link>
      </p>
      <p className="text-xs text-ink-500 mt-6">Demo: student@forge.dev / password</p>
      <style jsx>{`
        .input { width: 100%; padding: 0.6rem 0.8rem; background: rgb(22 27 42); border: 1px solid rgb(52 59 83); border-radius: 0.5rem; color: white; }
        .input:focus { outline: none; border-color: rgb(61 204 255); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-ink-300 mb-1">{label}</span>
      {children}
    </label>
  );
}
