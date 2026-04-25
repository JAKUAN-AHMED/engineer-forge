'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/store';
import type { QuizPublic, QuizResult } from '@forge/shared';

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

  if (err) return <div className="text-red-400">{err}</div>;
  if (!quiz) return <div className="text-ink-400">Loading quiz…</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">{quiz.title}</h1>
      <div className="text-xs text-ink-400 mb-6">Passing: {quiz.passingPct}%</div>

      {quiz.questions.map((q, i) => {
        const picked = (answers[i] as number[] | string) ?? (q.type === 'short' || q.type === 'code-output' ? '' : []);
        const feedback = result?.perQuestion[i];
        return (
          <div key={i} className={`rounded-xl border p-5 mb-4 ${
            feedback ? (feedback.correct ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5') : 'border-ink-800 bg-ink-900/40'
          }`}>
            <div className="text-sm text-ink-400">Question {i + 1} · {q.points} pts</div>
            <pre className="text-white font-sans whitespace-pre-wrap mt-1">{q.prompt}</pre>
            {(q.type === 'mcq' || q.type === 'multi') && q.choices && (
              <div className="mt-3 space-y-2">
                {q.choices.map((c, idx) => (
                  <label key={idx} className="flex items-start gap-2 text-sm">
                    <input
                      type={q.type === 'mcq' ? 'radio' : 'checkbox'}
                      name={`q${i}`}
                      checked={Array.isArray(picked) ? picked.includes(idx) : false}
                      onChange={() => toggle(i, idx, q.type === 'multi')}
                      disabled={!!result}
                      className="mt-1"
                    />
                    <span className="text-ink-100">{c}</span>
                  </label>
                ))}
              </div>
            )}
            {(q.type === 'short' || q.type === 'code-output') && (
              <input
                type="text"
                value={typeof picked === 'string' ? picked : ''}
                onChange={(e) => setAns(i, e.target.value)}
                disabled={!!result}
                placeholder="Your answer"
                className="mt-3 w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2 text-ink-100 font-mono text-sm"
              />
            )}
            {feedback && (
              <div className="mt-3 text-sm text-ink-300 border-t border-ink-800 pt-3">
                <strong className={feedback.correct ? 'text-green-400' : 'text-red-400'}>
                  {feedback.correct ? '✓ Correct' : '✗ Incorrect'}
                </strong>{' '}
                — {feedback.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!result ? (
        <button
          onClick={submit}
          disabled={submitting || !accessToken}
          className="px-5 py-2.5 rounded-lg bg-brand-500 text-ink-950 font-semibold hover:bg-brand-400 disabled:opacity-50"
        >
          {submitting ? 'Grading…' : 'Submit quiz'}
        </button>
      ) : (
        <div className={`rounded-xl p-5 border ${result.passed ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
          <div className="text-lg font-semibold text-white">
            {result.passed ? '🎉 Passed' : 'Not quite — try again'}
          </div>
          <div className="text-sm text-ink-200 mt-1">
            Score: {result.score} / {result.total} ({result.pct}%)
            {result.xpAwarded > 0 && <span className="ml-2 text-brand-300">+{result.xpAwarded} XP</span>}
          </div>
          <div className="mt-3">
            <Link href="/dashboard" className="underline">Back to dashboard</Link>
          </div>
        </div>
      )}

      {!accessToken && (
        <p className="text-xs text-ink-500 mt-3">
          <Link href="/login">Sign in</Link> to submit this quiz.
        </p>
      )}
    </div>
  );
}
