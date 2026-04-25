import type { Types } from 'mongoose';
import { Progress } from '../db/models/progress';
import { Lesson } from '../db/models/lesson';
import { User, type UserDoc } from '../db/models/user';
import { SECTION_ORDER, type SectionKey } from '@forge/shared';

const LEVEL_THRESHOLDS: Array<{ level: 'beginner' | 'engineer' | 'advanced'; minXp: number }> = [
  { level: 'beginner', minXp: 0 },
  { level: 'engineer', minXp: 500 },
  { level: 'advanced', minXp: 2000 },
];

function levelForXp(xp: number): 'beginner' | 'engineer' | 'advanced' {
  let current: 'beginner' | 'engineer' | 'advanced' = 'beginner';
  for (const t of LEVEL_THRESHOLDS) if (xp >= t.minXp) current = t.level;
  return current;
}

function isConsecutiveDay(last: Date | null, now: Date): boolean {
  if (!last) return false;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const lastMidnight = new Date(last);
  lastMidnight.setHours(0, 0, 0, 0);
  const nowMidnight = new Date(now);
  nowMidnight.setHours(0, 0, 0, 0);
  const diff = (nowMidnight.getTime() - lastMidnight.getTime()) / oneDayMs;
  return diff === 1;
}

function isSameDay(a: Date | null, b: Date): boolean {
  if (!a) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export async function markSectionViewed(
  userId: string,
  lessonId: string,
  sectionKey: SectionKey,
): Promise<{ sectionsCompleted: string[]; allSectionsDone: boolean }> {
  const doc = await Progress.findOneAndUpdate(
    { userId, lessonId },
    {
      $addToSet: { sectionsCompleted: sectionKey },
      $set: { lastViewedAt: new Date(), status: 'in-progress' },
    },
    { upsert: true, new: true },
  );
  const sectionsCompleted = doc?.sectionsCompleted ?? [];
  const allSectionsDone = SECTION_ORDER.every((k) => sectionsCompleted.includes(k));
  return { sectionsCompleted, allSectionsDone };
}

export async function completeLesson(userId: string, lessonId: string): Promise<{ xpAwarded: number; user: UserDoc }> {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error('lesson_not_found');

  const existing = await Progress.findOne({ userId, lessonId });
  const alreadyCompleted = existing?.status === 'completed';

  await Progress.findOneAndUpdate(
    { userId, lessonId },
    { $set: { status: 'completed', lastViewedAt: new Date() } },
    { upsert: true, new: true },
  );

  const user = await User.findById(userId);
  if (!user) throw new Error('user_not_found');
  if (!user.streak) user.streak = { current: 0, longest: 0, lastActiveDate: null };

  let xpAwarded = 0;
  if (!alreadyCompleted) {
    xpAwarded = lesson.xpReward;
    user.xp = (user.xp ?? 0) + xpAwarded;
    user.level = levelForXp(user.xp);
    if (!user.completedLessonIds.some((id: Types.ObjectId) => id.toString() === lessonId)) {
      user.completedLessonIds.push(lesson._id);
    }

    // streak update
    const now = new Date();
    const last = user.streak.lastActiveDate ?? null;
    if (isSameDay(last, now)) {
      // no change
    } else if (isConsecutiveDay(last, now)) {
      user.streak.current += 1;
      if (user.streak.current > user.streak.longest) user.streak.longest = user.streak.current;
    } else {
      user.streak.current = 1;
      if (user.streak.longest < 1) user.streak.longest = 1;
    }
    user.streak.lastActiveDate = now;

    await user.save();
  }

  return { xpAwarded, user: user as UserDoc };
}
