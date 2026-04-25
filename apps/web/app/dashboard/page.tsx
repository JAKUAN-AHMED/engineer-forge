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
      <div className="mx-auto mt-16 max-w-xl rounded-3xl border border-border bg-surface p-10 text-center shadow-xl shadow-black/10">
        <p className="text-sm text-text-secondary">You need to sign in to access your dashboard.</p>
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
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-surface/95 p-8 shadow-2xl shadow-black/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.28em] text-secondary">Dashboard</p>
            <h1 className="text-4xl font-semibold text-text-primary">Welcome back, {user.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-text-secondary">
              Your daily training hub for lessons, practice, and progress tracking.
            </p>
          </div>
          <Button variant="secondary">Continue learning</Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <StatsCard title="XP earned" value={user.xp.toString()} percent={progressPct} />
        <StatsCard title="Current streak" value={`🔥 ${user.streak.current} days`} />
        <StatsCard title="Lessons completed" value={summary ? `${summary.lessonsCompleted} / ${summary.totalLessons}` : 'Loading'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-secondary">Progress overview</p>
              <h2 className="text-xl font-semibold text-text-primary">Current learning pace</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Updated daily</span>
          </div>
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>XP to next tier</span>
                <span>{nextLevel === user.level ? 'Max' : `${nextThreshold - user.xp} XP`}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-sm text-text-secondary">Weak topics</p>
                <p className="mt-3 text-2xl font-semibold text-text-primary">{summary?.weakTopics.length ?? 0}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-sm text-text-secondary">Next milestone</p>
                <p className="mt-3 text-2xl font-semibold text-text-primary">{nextLevel}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <ActivityGraph />
          <Heatmap />
        </div>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">Recent activity</p>
            <h2 className="text-xl font-semibold text-text-primary">What you worked on</h2>
          </div>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </div>

        {!summary && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-border/50 p-6" />
              <div className="rounded-3xl bg-border/50 p-6" />
            </div>
          </div>
        )}

        {summary && summary.recentActivity.length === 0 && (
          <p className="text-text-secondary">No recent activity yet — start a course to fill this feed.</p>
        )}

        {summary?.recentActivity.length ? (
          <div className="space-y-4">
            {summary.recentActivity.map((item) => (
              <motion.div
                key={item.lessonSlug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-border bg-background p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">{item.lessonTitle}</p>
                    <p className="text-sm text-text-secondary">Lesson progress</p>
                  </div>
                  <span className="text-xs text-text-secondary">{new Date(item.at).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
