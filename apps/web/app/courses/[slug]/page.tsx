import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CURRICULUM } from '@forge/shared';

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = CURRICULUM.find((c) => c.slug === params.slug);
  if (!course) notFound();

  const lessonCount = course.modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div>
      <div className="text-brand-400 text-sm font-medium uppercase tracking-wide">Stage {course.stage}</div>
      <h1 className="text-3xl font-bold text-white mt-1">{course.title}</h1>
      <p className="text-ink-300 mt-2 max-w-2xl">{course.description}</p>
      <div className="text-xs text-ink-500 mt-3">
        {course.modules.length} modules · {lessonCount} lessons · ~{course.estimatedHours} hours
      </div>

      <div className="mt-8 space-y-6">
        {course.modules.map((m, i) => (
          <section key={m.slug}>
            <h2 className="text-lg font-semibold text-white">
              <span className="text-ink-500 font-mono text-sm mr-2">{String(i + 1).padStart(2, '0')}</span>
              {m.title}
            </h2>
            <p className="text-sm text-ink-400">{m.description}</p>
            <div className="mt-2 rounded-lg border border-ink-800 divide-y divide-ink-800 overflow-hidden">
              {m.lessons.map((l, j) => (
                <Link
                  key={l.slug}
                  href={`/lessons/${l.slug}`}
                  className="flex items-center justify-between px-4 py-3 bg-ink-900/30 hover:bg-ink-900/60"
                >
                  <div>
                    <span className="text-ink-500 font-mono text-xs mr-3">{String(j + 1).padStart(2, '0')}</span>
                    <span className="text-ink-100">{l.title}</span>
                  </div>
                  <div className="text-xs text-ink-500">
                    {l.authored ? <span className="text-brand-400">● authored</span> : '○ stub'} · {l.estimatedMinutes}m
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
