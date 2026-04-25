'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsCard } from '@/components/ui/StatsCard';
import { ActivityGraph } from '@/components/ui/ActivityGraph';
import { Heatmap } from '@/components/ui/Heatmap';

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
      <div className="mx-auto mt-16 max-w-xl glass-card p-10 text-center">
        <p className="text-sm text-text-secondary font-medium">You need to sign in to access your dashboard.</p>
        <Link href="/login">
          <Button className="mt-6" variant="primary">
            Sign in
          </Button>
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
    <div className="space-y-8 pb-16 pt-2">
      <section className="glass-card p-8 md:p-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-96 w-96 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase font-bold tracking-[0.28em] text-secondary">Dashboard</p>
            <h1 className="text-4xl font-extrabold text-text-primary">Welcome back, {user.name}</h1>
            <p className="max-w-2xl text-base leading-7 text-text-secondary">
              Your daily training hub for lessons, practice, and progress tracking.
            </p>
          </div>
          <Button variant="primary">Continue learning</Button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="XP earned" value={user.xp.toString()} percent={progressPct} />
        <StatsCard title="Current streak" value={`🔥 ${user.streak.current} days`} />
        <StatsCard title="Lessons completed" value={summary ? `${summary.lessonsCompleted} / ${summary.totalLessons}` : 'Loading...'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] font-bold text-secondary">Progress overview</p>
              <h2 className="text-2xl font-bold text-text-primary mt-1">Current learning pace</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">Updated daily</span>
          </div>
          <div className="space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-semibold text-text-secondary">
                <span>XP to next tier</span>
                <span className="text-primary">{nextLevel === user.level ? 'Max' : `${nextThreshold - user.xp} XP`}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-border-glass ring-1 ring-inset ring-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" 
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              <div className="glass-card p-6 shadow-none hover:shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wider text-text-secondary">Weak topics</p>
                <p className="mt-3 text-3xl font-extrabold text-text-primary">{summary?.weakTopics.length ?? 0}</p>
              </div>
              <div className="glass-card p-6 shadow-none hover:shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wider text-text-secondary">Next milestone</p>
                <p className="mt-3 text-3xl font-extrabold text-text-primary capitalize">{nextLevel}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6 overflow-hidden">
          <ActivityGraph />
          <Heatmap />
        </div>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-secondary">Recent activity</p>
            <h2 className="text-2xl font-bold text-text-primary mt-1">What you worked on</h2>
          </div>
          <Button variant="secondary">
            View all
          </Button>
        </div>

        {!summary && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-20 rounded-2xl bg-border-glass animate-pulse" />
              <div className="h-20 rounded-2xl bg-border-glass animate-pulse" />
            </div>
          </div>
        )}

        {summary && summary.recentActivity.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-text-secondary font-medium">No recent activity yet — start a course to fill this feed.</p>
          </div>
        )}

        {summary?.recentActivity.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {summary.recentActivity.map((item, i) => (
              <motion.div
                key={item.lessonSlug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.1 }}
                className="group glass-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md cursor-pointer"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{item.lessonTitle}</p>
                    <span className="text-xs font-semibold text-text-secondary bg-surface px-2 py-1 rounded-md ring-1 ring-inset ring-white/5">{new Date(item.at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-text-secondary font-medium">Continue lesson →</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
