'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';

interface Summary {
  xp: number;
  level: 'beginner' | 'engineer' | 'advanced';
  streak: { current: number; longest: number };
  lessonsCompleted: number;
  totalLessons: number;
  weakTopics: string[];
  recentActivity: { lessonSlug: string; lessonTitle: string; at: string }[];
}

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    api
      .get<{ summary: Summary }>('/api/progress/me', accessToken)
      .then((r) => setSummary(r.summary))
      .catch((e) => setErr((e as Error).message));
  }, [accessToken]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <p className="text-ink-300">You need to sign in to see your dashboard.</p>
        <Link href="/login" className="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-500 text-ink-950 font-semibold">
          Sign in
        </Link>
      </div>
    );
  }

  const levelOrder: Array<'beginner' | 'engineer' | 'advanced'> = ['beginner', 'engineer', 'advanced'];
  const nextIdx = Math.min(levelOrder.indexOf(user.level) + 1, 2);
  const thresholds = { beginner: 0, engineer: 500, advanced: 2000 };
  const nextLevel = levelOrder[nextIdx];
  const nextThreshold = thresholds[nextLevel];
  const progressPct = nextLevel === user.level ? 100 : Math.min(100, Math.round((user.xp / nextThreshold) * 100));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-ink-400 text-sm">Welcome back,</p>
        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-ink-400">XP</div>
          <div className="text-3xl font-bold text-white mt-1">{user.xp}</div>
          <div className="text-xs text-ink-400 mt-2">Level: <span className="text-brand-300">{user.level}</span></div>
          <div className="mt-3 h-2 rounded-full bg-ink-800 overflow-hidden">
            <div className="h-full bg-brand-500" style={{ width: `${progressPct}%` }} />
          </div>
          {nextLevel !== user.level && (
            <div className="text-xs text-ink-500 mt-2">{nextThreshold - user.xp} XP to {nextLevel}</div>
          )}
        </Card>

        <Card>
          <div className="text-sm text-ink-400">Streak</div>
          <div className="text-3xl font-bold text-white mt-1">🔥 {user.streak.current} day{user.streak.current === 1 ? '' : 's'}</div>
          <div className="text-xs text-ink-400 mt-2">Longest: {user.streak.longest}</div>
        </Card>

        <Card>
          <div className="text-sm text-ink-400">Lessons completed</div>
          <div className="text-3xl font-bold text-white mt-1">
            {summary?.lessonsCompleted ?? 0}
            <span className="text-lg text-ink-500"> / {summary?.totalLessons ?? '—'}</span>
          </div>
          {summary && summary.totalLessons > 0 && (
            <div className="mt-3 h-2 rounded-full bg-ink-800 overflow-hidden">
              <div className="h-full bg-brand-500" style={{ width: `${(summary.lessonsCompleted / summary.totalLessons) * 100}%` }} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-3">Recent activity</h2>
          {!summary && <p className="text-ink-500 text-sm">{err ?? 'Loading…'}</p>}
          {summary && summary.recentActivity.length === 0 && (
            <p className="text-ink-500 text-sm">No activity yet. <Link href="/courses">Start a course →</Link></p>
          )}
          <ul className="space-y-2">
            {summary?.recentActivity.map((a) => (
              <li key={a.lessonSlug}>
                <Link href={`/lessons/${a.lessonSlug}`} className="text-ink-100 hover:text-brand-300">
                  ▸ {a.lessonTitle}
                </Link>
                <span className="text-xs text-ink-500 ml-2">{new Date(a.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-3">Weak topics</h2>
          {summary && summary.weakTopics.length === 0 && (
            <p className="text-ink-500 text-sm">None detected yet. Keep taking quizzes to unlock personalized insights.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {summary?.weakTopics.map((t) => (
              <span key={t} className="text-sm px-3 py-1 rounded-full border border-ink-700 text-ink-200">{t}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-3">Badges</h2>
        {user.badges.length === 0 ? (
          <p className="text-ink-500 text-sm">No badges yet — complete lessons to earn them.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b) => (
              <span key={b} className="text-sm px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/40 text-brand-300">🏅 {b}</span>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">{children}</div>;
}
