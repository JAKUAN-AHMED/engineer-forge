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
    <div>
      <div className="text-sm text-gray-600 mb-1"><Link href="/courses">Curriculum</Link> · Lesson</div>
      <h1 className="text-3xl font-bold text-black">{lesson.title}</h1>
      <div className="text-sm text-gray-600 mt-1">~{lesson.estimatedMinutes} min · {lesson.xpReward} XP on completion</div>

      {xpBanner !== null && (
        <div className="mt-4 rounded-lg border border-blue-500 bg-blue-50 text-blue-900 px-4 py-3">
          🎉 Lesson completed! {xpBanner > 0 ? `+${xpBanner} XP` : 'You already earned XP for this lesson.'}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-1 border-b border-gray-300">
        {SECTION_ORDER.map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`px-3 py-2 text-sm rounded-t-md border-b-2 ${
              active === k
                ? 'border-blue-500 text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {completed.has(k) && <span className="text-blue-600 mr-1">●</span>}
            {SECTION_LABEL[k]}
          </button>
        ))}
      </div>

      <article className="prose-forge mt-6">
        {active === 'simpleExplanation' && <Markdown source={s.simpleExplanation.body} />}
        {active === 'visual' && <Markdown source={s.visual.body} />}
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
            {s.interviewQuestions.items.length === 0 && <p>Coming soon.</p>}
            {s.interviewQuestions.items.map((q, i) => (
              <details key={i} className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                <summary className="cursor-pointer font-medium text-black">
                  {q.company && <span className="text-blue-600 text-xs mr-2">[{q.company}]</span>}
                  <span className="text-gray-600 text-xs mr-2">difficulty {q.difficulty}/3</span>
                  <Markdown source={q.prompt} inline />
                </summary>
                <div className="mt-3 text-gray-800">
                  <Markdown source={q.answer} />
                </div>
              </details>
            ))}
          </div>
        )}
        {active === 'practiceProblems' && (
          <div>
            {s.practiceProblems.items.length === 0 && <p>Coming soon.</p>}
            <ul className="space-y-2">
              {s.practiceProblems.items.map((p) => (
                <li key={p.slug} className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
                  <span>{p.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    p.difficulty === 'easy' ? 'border-green-500 text-green-700' :
                    p.difficulty === 'medium' ? 'border-yellow-500 text-yellow-700' :
                    'border-red-500 text-red-700'
                  }`}>{p.difficulty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {active === 'thinkLikeEngineer' && <Markdown source={s.thinkLikeEngineer.body} />}
      </article>

      <div className="mt-10 border-t border-gray-300 pt-6">
        <h2 className="text-lg font-semibold text-black mb-3">Try it yourself</h2>
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

      <div className="mt-10 flex items-center justify-between">
        <Link href={`/quiz/${lesson.id}`} className="px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-400 text-black">
          Take the quiz →
        </Link>
        <button
          onClick={complete}
          disabled={!accessToken || !allSectionsDone}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40"
          title={allSectionsDone ? 'Mark lesson complete' : 'View all sections first'}
        >
          Mark lesson complete
        </button>
      </div>
    </div>
  );
}
