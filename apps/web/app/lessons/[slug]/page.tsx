import { notFound } from 'next/navigation';
import { LessonView } from '@/components/LessonView';
import type { LessonFull } from '@forge/shared';
import { API_BASE } from '@/lib/api';

async function fetchLesson(slug: string): Promise<LessonFull | null> {
  try {
    const res = await fetch(`${API_BASE}/api/lessons/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { lesson: LessonFull };
    return json.lesson;
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await fetchLesson(params.slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
