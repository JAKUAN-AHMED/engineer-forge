'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/store';
import type { QuizPublic, QuizResult } from '@forge/shared';
import { motion } from 'framer-motion';

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const { accessToken } = useAuth();
  const [quiz, setQuiz] = useState<QuizPublic | null>(null);
  const [answers, setAnswers] = useState<(number[] | string)[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ quiz: QuizPublic }>(`/api/quizzes/${params.lessonId}`)
      .then((r) => {
        setQuiz(r.quiz);
        setAnswers(r.quiz.questions.map((q) => (q.type === 'short' || q.type === 'code-output' ? '' : [])));
      })
      .catch((e) => setErr((e as Error).message));
  }, [params.lessonId]);

  function setAns(i: number, v: number[] | string) {
    setAnswers((a) => a.map((x, idx) => (idx === i ? v : x)));
  }

  function toggle(i: number, choiceIdx: number, multi: boolean) {
    const prev = (answers[i] as number[]) ?? [];
    if (!multi) return setAns(i, [choiceIdx]);
    setAns(i, prev.includes(choiceIdx) ? prev.filter((x) => x !== choiceIdx) : [...prev, choiceIdx]);
  }

  async function submit() {
    if (!accessToken) return setErr('Sign in to submit the quiz.');
    setSubmitting(true);
    try {
      const r = await api.post<QuizResult>(`/api/quizzes/${params.lessonId}/submit`, { answers }, accessToken);
      setResult(r);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (err) return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="glass-card p-8 text-center text-error border-error/20 bg-error/5 max-w-md">
        <h2 className="text-xl font-bold mb-2">Error loading quiz</h2>
        <p className="text-sm">{err}</p>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="flex h-[70vh] items-center justify-center space-y-4 flex-col">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface border-t-primary" />
      <span className="text-text-secondary font-semibold animate-pulse text-sm uppercase tracking-widest">Loading assessment...</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass-card p-8 md:p-10 mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 h-48 w-48 bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.26em] text-secondary">Knowledge Check</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-text-primary drop-shadow-sm">{quiz.title}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-surface/80 border border-border-glass px-4 py-2.5 shadow-sm">
             <span className="text-xs uppercase font-bold text-text-secondary tracking-wider">Passing Score</span>
             <span className="text-lg font-extrabold text-primary">{quiz.passingPct}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, i) => {
          const picked = (answers[i] as number[] | string) ?? (q.type === 'short' || q.type === 'code-output' ? '' : []);
          const feedback = result?.perQuestion[i];
          return (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} 
              className={`glass-card p-6 md:p-8 transition-colors ${
              feedback ? (feedback.correct ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5') : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-secondary">Question {i + 1}</span>
                <span className="rounded-md bg-surface border border-border-glass px-2.5 py-1 text-xs font-bold text-text-secondary shadow-sm">{q.points} pt{q.points !== 1 ? 's' : ''}</span>
              </div>
              <pre className="text-lg font-semibold text-text-primary whitespace-pre-wrap font-sans leading-relaxed">{q.prompt}</pre>
              
              {(q.type === 'mcq' || q.type === 'multi') && q.choices && (
                <div className="mt-6 space-y-3">
                  {q.choices.map((c, idx) => {
                    const isSelected = Array.isArray(picked) ? picked.includes(idx) : false;
                    return (
                      <label key={idx} className={`group flex cursor-pointer items-start border p-4 rounded-xl transition-all ${
                        isSelected ? 'bg-primary/10 border-primary shadow-sm' : 'bg-surface/50 border-border-glass hover:bg-surface'
                      } ${feedback ? 'cursor-default pointer-events-none' : ''}`}>
                        <div className="flex h-5 items-center">
                          <input
                            type={q.type === 'mcq' ? 'radio' : 'checkbox'}
                            name={`q${i}`}
                            checked={isSelected}
                            onChange={() => toggle(i, idx, q.type === 'multi')}
                            disabled={!!result}
                            className={`h-4 w-4 bg-background border-border-glass transition-colors ${q.type === 'mcq' ? 'rounded-full' : 'rounded'}`}
                          />
                        </div>
                        <div className="ml-3 text-sm font-medium text-text-primary">
                          {c}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {(q.type === 'short' || q.type === 'code-output') && (
                <input
                  type="text"
                  value={typeof picked === 'string' ? picked : ''}
                  onChange={(e) => setAns(i, e.target.value)}
                  disabled={!!result}
                  placeholder={q.type === 'code-output' ? "Expected output..." : "Your answer..."}
                  className="mt-6 w-full bg-background border border-border-glass rounded-xl px-4 py-3.5 text-text-primary font-mono text-sm shadow-inner focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                />
              )}

              {feedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-4 border-t border-border-glass">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-bold uppercase tracking-wider ${feedback.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {feedback.correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="text-text-secondary">— {feedback.explanation}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {!result ? (
          <div className="flex flex-col sm:flex-row w-full sm:justify-between items-center gap-4">
            {!accessToken && (
              <p className="text-sm font-semibold text-text-secondary">
                <Link href="/login" className="text-primary hover:underline hover:text-secondary transition-colors">Sign in</Link> to submit this quiz.
              </p>
            )}
            {accessToken && <div />}
            <button
              onClick={submit}
              disabled={submitting || !accessToken}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none disabled:transform-none"
            >
              {submitting ? 'Grading...' : 'Submit quiz'}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full glass-card p-8 border ${result.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className={`text-2xl font-extrabold ${result.passed ? 'text-emerald-400' : 'text-text-primary'}`}>
                  {result.passed ? '🎉 Passed' : 'Not quite — try again'}
                </div>
                <div className="text-base font-medium text-text-secondary mt-2 flex flex-wrap items-center gap-2">
                  <span className="bg-surface border border-border-glass px-3 py-1 rounded-md shadow-sm text-text-primary font-bold">
                    Score: {result.score} / {result.total} ({result.pct}%)
                  </span>
                  {result.xpAwarded > 0 && <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-md shadow-sm font-bold">+{result.xpAwarded} XP</span>}
                </div>
              </div>
              <Link href="/dashboard" className="w-full md:w-auto text-center rounded-xl bg-surface border border-border-glass px-6 py-3 text-sm font-bold text-text-primary shadow-sm hover:bg-surface/50 hover:shadow-md transition-all whitespace-nowrap">
                Back to dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
