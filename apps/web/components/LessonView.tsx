'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SECTION_LABEL, SECTION_ORDER, type SectionKey, type LessonFull } from '@forge/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/store';
import { CodeRunner } from './CodeRunner';
import { DryRunViewer } from './DryRunViewer';
import { Markdown } from './Markdown';

export function LessonView({ lesson }: { lesson: LessonFull }) {
  const { accessToken } = useAuth();
  const [active, setActive] = useState<SectionKey>('simpleExplanation');
  const [completed, setCompleted] = useState<Set<SectionKey>>(new Set());
  const [xpBanner, setXpBanner] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    void api
      .post<{ sectionsCompleted: string[] }>(`/api/progress/lesson/${lesson.id}/section`, { sectionKey: active }, accessToken)
      .then((r) => setCompleted(new Set(r.sectionsCompleted as SectionKey[])))
      .catch(() => { /* non-fatal */ });
  }, [active, lesson.id, accessToken]);

  async function complete() {
    if (!accessToken) return;
    const r = await api.post<{ xpAwarded: number }>(`/api/progress/lesson/${lesson.id}/complete`, {}, accessToken);
    setXpBanner(r.xpAwarded);
  }

  const s = lesson.sections;
  const allSectionsDone = SECTION_ORDER.every((k) => completed.has(k));

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">Curriculum · Lesson</div>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">{lesson.title}</h1>
            <p className="mt-2 text-sm text-slate-600">~{lesson.estimatedMinutes} min · {lesson.xpReward} XP on completion</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">{lesson.estimatedMinutes} min</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">{lesson.xpReward} XP</span>
          </div>
        </div>
      </div>

      {xpBanner !== null && (
        <div className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
          🎉 Lesson completed! {xpBanner > 0 ? `+${xpBanner} XP` : 'You already earned XP for this lesson.'}
        </div>
      )}

      <div className="overflow-x-auto rounded-t-3xl border-b border-slate-200 bg-white shadow-sm">
        <div className="flex min-w-max gap-2 px-3 py-3">
          {SECTION_ORDER.map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active === k
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {completed.has(k) && <span className="text-sky-400 mr-1">●</span>}
              {SECTION_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <article className="prose-forge rounded-b-3xl border border-t-0 border-slate-200 bg-white p-8 shadow-lg">
        {active === 'simpleExplanation' && <Markdown source={s.simpleExplanation.body} />}
        {active === 'visual' && (
          <div className="space-y-5">
            <Markdown source={s.visual.body} />
            {s.visual.diagramUrl && (
              <img src={s.visual.diagramUrl} alt="Visual diagram" className="rounded-3xl border border-slate-200 bg-slate-50" />
            )}
          </div>
        )}
        {active === 'deepBreakdown' && <Markdown source={s.deepBreakdown.body} />}
        {active === 'dryRun' && (
          <>
            <Markdown source={s.dryRun.body} />
            {s.dryRun.steps?.length > 0 && <div className="mt-4"><DryRunViewer steps={s.dryRun.steps} /></div>}
          </>
        )}
        {active === 'commonMistakes' && <Markdown source={s.commonMistakes.body} />}
        {active === 'interviewQuestions' && (
          <div className="space-y-4">
            {s.interviewQuestions.items.length === 0 && <p className="text-slate-600">This lesson includes expert-style interview prompts for deeper learning.</p>}
            {s.interviewQuestions.items.map((q, i) => (
              <details key={i} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer font-semibold text-slate-950">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    {q.company && <span className="rounded-full bg-slate-100 px-2 py-1">{q.company}</span>}
                    <span>difficulty {q.difficulty}/3</span>
                  </div>
                  <div className="mt-2">
                    <Markdown source={q.prompt} inline />
                  </div>
                </summary>
                <div className="mt-4 text-slate-700">
                  <Markdown source={q.answer} />
                </div>
              </details>
            ))}
          </div>
        )}
        {active === 'practiceProblems' && (
          <div>
            {s.practiceProblems.items.length === 0 && <p className="text-slate-600">Practice prompts are available for every lesson to help you apply the concept.</p>}
            <div className="space-y-3">
              {s.practiceProblems.items.map((p) => (
                <div key={p.slug} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-slate-900">{p.title}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                    p.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>{p.difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {active === 'thinkLikeEngineer' && <Markdown source={s.thinkLikeEngineer.body} />}
      </article>

      <div className="space-y-6 md:flex md:items-center md:justify-between md:space-y-0">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Try it yourself</h2>
          <p className="mt-2 text-sm text-slate-600">Run sample code in the browser and inspect output instantly.</p>
          <div className="mt-4">
            <CodeRunner
              title="Event loop sandbox"
              initial={[
                "console.log('a');",
                "setTimeout(() => console.log('b'), 0);",
                "Promise.resolve().then(() => console.log('c'));",
                "console.log('d');",
              ].join('\n')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={`/quiz/${lesson.id}`} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900 transition">
            Take the quiz →
          </Link>
          <button
            onClick={complete}
            disabled={!accessToken || !allSectionsDone}
            className="inline-flex items-center justify-center rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-40"
            title={allSectionsDone ? 'Mark lesson complete' : 'View all sections first'}
          >
            Mark lesson complete
          </button>
        </div>
      </div>
    </div>
  );
}
