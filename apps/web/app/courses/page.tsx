import Link from 'next/link';
import { CURRICULUM } from '@forge/shared';

export default function CoursesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Curriculum</h1>
      <p className="text-ink-300 mb-8 max-w-2xl">
        Five stages, from silicon to interview. Stage 1 builds the mental model; by Stage 5 you're practicing on company-tagged problems and mock interviews.
      </p>

      <div className="space-y-8">
        {CURRICULUM.map((c) => (
          <section key={c.slug}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-white">
                <span className="text-brand-400 font-mono text-sm">{String(c.stage).padStart(2, '0')}</span>{' '}
                {c.title}
              </h2>
              <Link href={`/courses/${c.slug}`} className="text-sm">
                View course →
              </Link>
            </div>
            <p className="text-sm text-ink-400 mt-1 mb-3">{c.description}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {c.modules.map((m) => (
                <div key={m.slug} className="rounded-lg border border-ink-800 bg-ink-900/30 p-4">
                  <div className="font-semibold text-ink-100">{m.title}</div>
                  <div className="text-xs text-ink-400 mb-2">{m.description}</div>
                  <ul className="text-sm space-y-1">
                    {m.lessons.map((l) => (
                      <li key={l.slug} className="flex items-center justify-between">
                        <Link href={`/lessons/${l.slug}`}>{l.title}</Link>
                        <span className="text-xs text-ink-500 ml-2">
                          {l.authored ? <span className="text-brand-400">● authored</span> : '○ stub'} · {l.estimatedMinutes}m
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
