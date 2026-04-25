import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  authored: boolean;
}

interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  stage: 1 | 2 | 3 | 4 | 5;
  order: number;
  estimatedHours: number;
  icon: string;
  tags: string[];
}

async function getCourse(slug: string): Promise<{ course: Course; modules: Module[] }> {
  return api.get(`/courses/${slug}`);
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const { course, modules } = await getCourse(params.slug);

  if (!course) notFound();

  const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="space-y-10 pb-16 pt-2">
      <div className="glass-card relative overflow-hidden p-8 md:p-10">
        <div className="absolute right-0 top-0 h-96 w-96 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-[0.26em] text-secondary">
              Stage {course.stage}
            </div>
            <h1 className="mt-3 text-4xl font-extrabold text-text-primary drop-shadow-sm">{course.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-text-secondary">{course.description}</p>
            <p className="mt-4 inline-block max-w-3xl rounded-2xl bg-surface px-5 py-3.5 text-sm font-medium text-text-secondary ring-1 ring-inset ring-white/5 shadow-inner">
              All course lessons are fully authored with explanations, dry-runs, common pitfalls, interview questions, and practice challenges.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-4 md:pt-0">
            <CardLabel label="Modules" value={`${modules.length}`} />
            <CardLabel label="Lessons" value={`${lessonCount}`} />
            <CardLabel label="Duration" value={`~${course.estimatedHours}h`} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {modules.map((m, i) => (
          <section key={m.slug} className="glass-card p-6 md:p-8 hover:border-primary/20 transition-colors">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Module {String(i + 1).padStart(2, '0')}</div>
                <h2 className="mt-2 text-2xl font-bold text-text-primary bg-clip-text">{m.title}</h2>
              </div>
              <div className="text-sm font-semibold text-text-secondary whitespace-nowrap bg-surface px-3 py-1.5 rounded-full ring-1 ring-inset ring-white/5">{m.lessons.length} lessons</div>
            </div>
            <p className="mt-4 max-w-4xl text-text-secondary">{m.description}</p>
            <div className="mt-8 grid gap-4">
              {m.lessons.map((l, j) => (
                <Link
                  key={l.slug}
                  href={`/lessons/${l.slug}`}
                  className="group flex flex-col rounded-2xl border border-border-glass bg-background p-5 text-text-primary transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 pr-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary group-hover:text-primary transition-colors">Lesson {String(j + 1).padStart(2, '0')}</div>
                    <div className="mt-2 text-lg font-bold group-hover:text-text-primary transition-colors">{l.title}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:mt-0 sm:text-right font-semibold">
                    <span className="rounded-md bg-surface px-3 py-1.5 text-text-secondary ring-1 ring-inset ring-white/5 shadow-sm">{l.estimatedMinutes} min</span>
                    <span className={`rounded-md px-3 py-1.5 shadow-sm ring-1 ring-inset ${l.authored ? 'bg-primary/20 text-primary ring-primary/30' : 'bg-surface text-text-secondary ring-white/5'}`}>{l.authored ? 'Complete' : 'Edited'}</span>
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

function CardLabel({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-[100px] rounded-2xl border border-border-glass bg-surface/80 px-4 py-4 text-center shadow-lg backdrop-blur-sm transition hover:shadow-xl hover:-translate-y-0.5">
      <div className="text-2xl font-extrabold text-text-primary drop-shadow-sm">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary mt-1">{label}</div>
    </div>
  );
}
