import crypto from 'crypto';
import { Certificate } from '../db/models/certificate';
import { Course } from '../db/models/course';
import { LessonModule } from '../db/models/module';
import { Lesson } from '../db/models/lesson';
import { User } from '../db/models/user';
import { HttpError } from '../middleware/errorHandler';

function generateVerificationId(): string {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `EF-${year}-${rand}`;
}

export async function issueCertificate(userId: string, courseId: string) {
  const [user, course] = await Promise.all([User.findById(userId), Course.findById(courseId)]);
  if (!user) throw new HttpError(404, 'user_not_found');
  if (!course) throw new HttpError(404, 'course_not_found');

  // Ensure all lessons in course are completed
  const modules = await LessonModule.find({ courseId });
  const lessonIds = modules.flatMap((m) => m.lessonIds.map((id) => id.toString()));
  const lessons = await Lesson.find({ _id: { $in: lessonIds } });
  const completedSet = new Set(user.completedLessonIds.map((id) => id.toString()));
  const incomplete = lessons.filter((l) => !completedSet.has(l._id.toString()));
  if (incomplete.length > 0) {
    throw new HttpError(400, 'course_not_complete');
  }

  const existing = await Certificate.findOne({ userId, courseId });
  if (existing) return existing;

  const cert = await Certificate.create({
    userId,
    courseId,
    verificationId: generateVerificationId(),
    userName: user.name,
    courseTitle: course.title,
    skills: course.tags,
  });
  return cert;
}
