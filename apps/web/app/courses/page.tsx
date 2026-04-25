import Link from 'next/link';
import { api } from '../../lib/api';

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
  moduleCount: number;
  lessonCount: number;
}

async function getCourses(): Promise<Course[]> {
  const res = await api.get<{ courses: Course[] }>('/courses');
  return res.courses;
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-sm">
          <span>Curriculum</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
          Explore every course
        </h1>
        <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
          Every lesson in this platform is authored and ready to use, with consistent structure, example walkthroughs, interview practice, and polished learning flows.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <div key={c.slug} className="group glass-card flex flex-col justify-between p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl">
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="inline-flex h-8 items-center justify-center rounded-full bg-primary/10 px-3 text-xs font-black uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/20">
                  Stage {c.stage}
                </div>
                {c.icon ? (
                  <div className="inline-flex h-8 w-auto min-w-[32px] items-center justify-center rounded-full bg-secondary/10 px-3 text-xs font-bold text-secondary ring-1 ring-inset ring-secondary/20">
                    {c.icon}
                  </div>
                ) : null}
              </div>
              <h2 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">{c.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{c.description}</p>
            </div>
            
            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap gap-2">
                {c.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-xl border border-border-glass bg-background/50 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 border-t border-border-glass pt-5 text-xs font-semibold text-text-secondary">
                <span>{c.moduleCount} modules</span>
                <span className="text-border-glass">•</span>
                <span>{c.lessonCount} lessons</span>
                <span className="text-border-glass">•</span>
                <span>~{c.estimatedHours}h</span>
              </div>
              
              <Link href={`/courses/${c.slug}`} className="mt-2 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all group-hover:bg-primary/90 group-hover:shadow-primary/40 group-hover:scale-[1.02]">
                Open course →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
