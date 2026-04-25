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

  const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div>
      <div className="text-blue-600 text-sm font-medium uppercase tracking-wide">Stage {course.stage}</div>
      <h1 className="text-3xl font-bold text-black mt-1">{course.title}</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">{course.description}</p>
      <div className="text-xs text-gray-500 mt-3">
        {modules.length} modules · {lessonCount} lessons · ~{course.estimatedHours} hours
      </div>

      <div className="mt-8 space-y-6">
        {modules.map((m, i) => (
          <section key={m.slug}>
            <h2 className="text-lg font-semibold text-black">
              <span className="text-gray-500 font-mono text-sm mr-2">{String(i + 1).padStart(2, '0')}</span>
              {m.title}
            </h2>
            <p className="text-sm text-gray-500">{m.description}</p>
            <div className="mt-2 rounded-lg border border-gray-300 divide-y divide-gray-300 overflow-hidden">
              {m.lessons.map((l, j) => (
                <Link
                  key={l.slug}
                  href={`/lessons/${l.slug}`}
                  className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50"
                >
                  <div>
                    <span className="text-gray-500 font-mono text-xs mr-3">{String(j + 1).padStart(2, '0')}</span>
                    <span className="text-black">{l.title}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {l.authored ? <span className="text-blue-600">● authored</span> : '○ stub'} · {l.estimatedMinutes}m
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
