import { connectDb, disconnectDb } from '../db/connect';
import { User } from '../db/models/user';
import { Course } from '../db/models/course';
import { LessonModule } from '../db/models/module';
import { Lesson } from '../db/models/lesson';
import { Quiz } from '../db/models/quiz';
import { Progress } from '../db/models/progress';
import { Certificate } from '../db/models/certificate';
import { CURRICULUM, SECTION_ORDER } from '@forge/shared';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const STUB_SECTIONS = Object.fromEntries(
  SECTION_ORDER.map((k) => {
    if (k === 'interviewQuestions') return [k, { items: [] }];
    if (k === 'practiceProblems') return [k, { items: [] }];
    if (k === 'dryRun') return [k, { body: '*Coming soon.*', steps: [] }];
    return [k, { body: '*Coming soon. This lesson is part of the curriculum roadmap and will be authored in a future release.*' }];
  }),
);

async function seed() {
  await connectDb();
  console.log('[seed] wiping existing data');
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    LessonModule.deleteMany({}),
    Lesson.deleteMany({}),
    Quiz.deleteMany({}),
    Progress.deleteMany({}),
    Certificate.deleteMany({}),
  ]);

  console.log('[seed] demo users');
  const pwHash = await bcrypt.hash('password', 12);
  await User.create([
    { email: 'student@forge.dev', passwordHash: pwHash, name: 'Demo Student', role: 'student' },
    { email: 'admin@forge.dev', passwordHash: pwHash, name: 'Demo Admin', role: 'admin' },
  ]);

  console.log('[seed] curriculum');
  // Load authored content
  const eventLoopPath = path.resolve(__dirname, '../../../../content/courses/core-javascript/async/event-loop.json');
  const eventLoopContent = JSON.parse(fs.readFileSync(eventLoopPath, 'utf-8'));

  for (const c of CURRICULUM) {
    const course = await Course.create({
      slug: c.slug,
      title: c.title,
      description: c.description,
      stage: c.stage,
      order: c.order,
      estimatedHours: c.estimatedHours,
      icon: c.icon,
      tags: c.tags,
    });

    for (const m of c.modules) {
      const mod = await LessonModule.create({
        courseId: course._id,
        slug: m.slug,
        title: m.title,
        description: m.description,
        order: c.modules.indexOf(m) + 1,
      });

      const lessonIds: typeof mod.lessonIds = [];
      for (const l of m.lessons) {
        const isAuthored = l.slug === eventLoopContent.slug;
        const sections = isAuthored ? eventLoopContent.sections : STUB_SECTIONS;
        const lesson = await Lesson.create({
          moduleId: mod._id,
          slug: l.slug,
          title: isAuthored ? eventLoopContent.title : l.title,
          order: m.lessons.indexOf(l) + 1,
          estimatedMinutes: l.estimatedMinutes,
          xpReward: isAuthored ? eventLoopContent.xpReward : 50,
          sections,
          authored: Boolean(isAuthored),
        });
        lessonIds.push(lesson._id);

        if (isAuthored && eventLoopContent.quiz) {
          await Quiz.create({
            lessonId: lesson._id,
            title: eventLoopContent.quiz.title,
            passingPct: eventLoopContent.quiz.passingPct,
            questions: eventLoopContent.quiz.questions,
          });
        }
      }
      mod.lessonIds = lessonIds;
      await mod.save();

      course.moduleIds.push(mod._id);
    }
    await course.save();
  }

  const counts = {
    users: await User.countDocuments(),
    courses: await Course.countDocuments(),
    modules: await LessonModule.countDocuments(),
    lessons: await Lesson.countDocuments(),
    quizzes: await Quiz.countDocuments(),
  };
  console.log('[seed] done:', counts);
  await disconnectDb();
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
