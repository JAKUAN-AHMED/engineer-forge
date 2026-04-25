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
    <div>
      <h1 className="text-3xl font-bold text-black mb-2">Curriculum</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Five stages, from silicon to interview. Stage 1 builds the mental model; by Stage 5 you're practicing on company-tagged problems and mock interviews.
      </p>

      <div className="space-y-8">
        {courses.map((c) => (
          <section key={c.slug}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-black">
                <span className="text-blue-600 font-mono text-sm">{String(c.stage).padStart(2, '0')}</span>{' '}
                {c.title}
              </h2>
              <Link href={`/courses/${c.slug}`} className="text-sm text-blue-600 hover:text-blue-800">
                View course →
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-3">{c.description}</p>
            <div className="text-sm text-gray-600">
              {c.moduleCount} modules · {c.lessonCount} lessons · {c.estimatedHours} hours
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
