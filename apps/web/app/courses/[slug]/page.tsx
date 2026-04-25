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
    <div className="space-y-10">
      <div className="glass-card border border-white/80 p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.26em] text-sky-700">
              Stage {course.stage}
            </div>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">{course.title}</h1>
            <p className="mt-4 max-w-3xl text-slate-600">{course.description}</p>
            <p className="mt-4 max-w-3xl rounded-3xl bg-slate-950/5 px-4 py-3 text-sm text-slate-700">All course lessons are fully authored with explanations, dry-runs, common pitfalls, interview questions, and practice challenges.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <CardLabel label="Modules" value={`${modules.length}`} />
            <CardLabel label="Lessons" value={`${lessonCount}`} />
            <CardLabel label="Duration" value={`~${course.estimatedHours}h`} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {modules.map((m, i) => (
          <section key={m.slug} className="glass-card border border-white/80 p-6 shadow-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-sky-700">Module {String(i + 1).padStart(2, '0')}</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{m.title}</h2>
              </div>
              <div className="text-sm text-slate-500">{m.lessons.length} lessons</div>
            </div>
            <p className="mt-3 text-slate-600">{m.description}</p>
            <div className="mt-6 grid gap-3">
              {m.lessons.map((l, j) => (
                <Link
                  key={l.slug}
                  href={`/lessons/${l.slug}`}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Lesson {String(j + 1).padStart(2, '0')}</div>
                    <div className="mt-2 text-lg font-semibold">{l.title}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 sm:mt-0 sm:text-right">
                    <span className="rounded-full bg-slate-100 px-2 py-1">{l.estimatedMinutes} min</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">{l.authored ? 'Complete' : 'Edited'}</span>
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
    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-center">
      <div className="text-xl font-semibold text-slate-950">{value}</div>
      <div className="text-xs uppercase tracking-[0.26em] text-slate-500 mt-1">{label}</div>
    </div>
  );
}
