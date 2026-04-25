'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SECTION_LABEL, SECTION_ORDER, type SectionKey, type LessonFull } from '@forge/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/store';
import { CodeRunner } from './CodeRunner';
import { DryRunViewer } from './DryRunViewer';
import { Markdown } from './Markdown';
import { motion } from 'framer-motion';

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
    <div className="space-y-8 pb-16 pt-2">
      <div className="glass-card relative overflow-hidden p-8 md:p-10">
        <div className="absolute right-0 top-0 h-64 w-64 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.26em] text-secondary">Curriculum · Lesson</div>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-text-primary drop-shadow-sm">{lesson.title}</h1>
            <p className="mt-4 text-base font-medium text-text-secondary">~{lesson.estimatedMinutes} min · {lesson.xpReward} XP on completion</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-text-secondary mt-2 md:mt-0">
            <span className="rounded-xl border border-border-glass bg-surface/50 px-4 py-2.5 shadow-sm ring-1 ring-inset ring-white/5">{lesson.estimatedMinutes} min</span>
            <span className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-primary shadow-sm ring-1 ring-inset ring-primary/20">+{lesson.xpReward} XP</span>
          </div>
        </div>
      </div>

      {xpBanner !== null && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-emerald-400 font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-3"
        >
          <span className="text-xl">🎉</span> 
          {xpBanner > 0 ? `Lesson completed! +${xpBanner} XP earned!` : 'Lesson completed! You already earned XP for this lesson.'}
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto border-b border-border-glass bg-surface/30 px-3 py-3 custom-scrollbar">
          {SECTION_ORDER.map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all relative outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary ${
                active === k
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              {completed.has(k) && <span className={`mr-1.5 ${active === k ? 'text-white' : 'text-primary'}`}>●</span>}
              {SECTION_LABEL[k]}
            </button>
          ))}
        </div>

        <article className="prose-forge p-6 md:p-10">
          {active === 'simpleExplanation' && <Markdown source={s.simpleExplanation.body} />}
          {active === 'visual' && (
            <div className="space-y-6">
              <Markdown source={s.visual.body} />
              {s.visual.diagramUrl && (
                 <div className="rounded-2xl border border-border-glass p-2 bg-surface/50 shadow-inner">
                   <img src={s.visual.diagramUrl} alt="Visual diagram" className="rounded-xl w-full" />
                 </div>
              )}
            </div>
          )}
          {active === 'deepBreakdown' && <Markdown source={s.deepBreakdown.body} />}
          {active === 'dryRun' && (
            <div className="space-y-6">
              <Markdown source={s.dryRun.body} />
              {s.dryRun.steps?.length > 0 && <div className="mt-8 rounded-2xl overflow-hidden border border-border-glass shadow-lg"><DryRunViewer steps={s.dryRun.steps} /></div>}
            </div>
          )}
          {active === 'commonMistakes' && <Markdown source={s.commonMistakes.body} />}
          {active === 'interviewQuestions' && (
            <div className="space-y-5">
              {s.interviewQuestions.items.length === 0 && <p className="text-text-secondary font-medium">This lesson includes expert-style interview prompts for deeper learning.</p>}
              {s.interviewQuestions.items.map((q, i) => (
                <details key={i} className="group rounded-2xl border border-border-glass bg-surface/50 p-5 shadow-sm transition-all hover:bg-surface open:bg-surface open:shadow-md">
                  <summary className="cursor-pointer font-bold text-text-primary outline-none">
                    <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                      {q.company && <span className="rounded-md bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 tracking-wider uppercase">{q.company}</span>}
                      <span className="text-text-secondary bg-background border border-border-glass px-2.5 py-1 rounded-md">Difficulty {q.difficulty}/3</span>
                    </div>
                    <div className="mt-2 group-open:text-primary transition-colors text-lg">
                      <Markdown source={q.prompt} inline />
                    </div>
                  </summary>
                  <div className="mt-6 pt-5 border-t border-border-glass text-text-secondary">
                    <Markdown source={q.answer} />
                  </div>
                </details>
              ))}
            </div>
          )}
          {active === 'practiceProblems' && (
            <div>
              {s.practiceProblems.items.length === 0 && <p className="text-text-secondary font-medium">Practice prompts are available for every lesson to help you apply the concept.</p>}
              <div className="space-y-4">
                {s.practiceProblems.items.map((p) => (
                  <div key={p.slug} className="flex flex-col gap-4 rounded-2xl border border-border-glass bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-md hover:border-primary/30">
                    <span className="font-bold text-text-primary text-lg">{p.title}</span>
                    <span className={`rounded-xl px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm ring-1 ring-inset ${
                      p.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' :
                      p.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                    }`}>{p.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {active === 'thinkLikeEngineer' && <Markdown source={s.thinkLikeEngineer.body} />}
        </article>
      </div>

      <div className="space-y-6 md:grid md:grid-cols-[1.4fr_1fr] md:gap-8 md:space-y-0 items-stretch">
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-text-primary">Try it yourself</h2>
            <p className="mt-2 mb-6 text-sm font-medium text-text-secondary">Run sample code in the browser and inspect output instantly.</p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border border-border-glass">
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

        <div className="glass-card p-6 md:p-8 flex flex-col justify-center gap-4">
          <div className="text-center mb-2">
            <h3 className="font-bold text-text-primary text-lg">Ready to advance?</h3>
            <p className="text-xs text-text-secondary mt-1">Validate your knowledge with a quiz.</p>
          </div>
          <Link href={`/quiz/${lesson.id}`} className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-primary p-[1px] shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">
            <span className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-bold text-white transition-all group-hover:bg-transparent">
              Take the quiz <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
          <button
            onClick={complete}
            disabled={!accessToken || !allSectionsDone}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-border-glass px-6 py-3.5 text-sm font-bold text-text-primary shadow-sm ring-1 ring-inset ring-white/5 transition-all hover:bg-surface disabled:opacity-40 disabled:hover:bg-border-glass"
            title={allSectionsDone ? 'Mark lesson complete' : 'View all sections first'}
          >
            {allSectionsDone ? 'Mark lesson complete ✓' : 'View all sections first'}
          </button>
        </div>
      </div>
    </div>
  );
}
