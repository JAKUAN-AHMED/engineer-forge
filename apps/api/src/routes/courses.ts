import { Router } from 'express';
import { Course } from '../db/models/course';
import { LessonModule } from '../db/models/module';
import { Lesson } from '../db/models/lesson';
import { HttpError } from '../middleware/errorHandler';

export const coursesRouter = Router();

coursesRouter.get('/', async (req, res, next) => {
  try {
    const stage = req.query.stage ? Number(req.query.stage) : undefined;
    const filter = stage ? { stage } : {};
    const courses = await Course.find(filter).sort({ order: 1 });

    const enriched = await Promise.all(
      courses.map(async (c) => {
        const modules = await LessonModule.find({ courseId: c._id });
        const lessonCount = modules.reduce((a, m) => a + m.lessonIds.length, 0);
        return {
          id: c._id.toString(),
          slug: c.slug,
          title: c.title,
          description: c.description,
          stage: c.stage as 1 | 2 | 3 | 4 | 5,
          order: c.order,
          estimatedHours: c.estimatedHours,
          icon: c.icon,
          tags: c.tags,
          moduleCount: modules.length,
          lessonCount,
        };
      }),
    );
    res.json({ courses: enriched });
  } catch (e) {
    next(e);
  }
});

coursesRouter.get('/:slug', async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) throw new HttpError(404, 'course_not_found');
    const modules = await LessonModule.find({ courseId: course._id }).sort({ order: 1 });
    const modulesWithLessons = await Promise.all(
      modules.map(async (m) => {
        const lessons = await Lesson.find({ _id: { $in: m.lessonIds } }).sort({ order: 1 });
        return {
          id: m._id.toString(),
          slug: m.slug,
          title: m.title,
          description: m.description,
          order: m.order,
          lessons: lessons.map((l) => ({
            id: l._id.toString(),
            slug: l.slug,
            title: l.title,
            order: l.order,
            estimatedMinutes: l.estimatedMinutes,
            authored: l.authored,
          })),
        };
      }),
    );
    res.json({
      course: {
        id: course._id.toString(),
        slug: course.slug,
        title: course.title,
        description: course.description,
        stage: course.stage,
        order: course.order,
        estimatedHours: course.estimatedHours,
        icon: course.icon,
        tags: course.tags,
      },
      modules: modulesWithLessons,
    });
  } catch (e) {
    next(e);
  }
});
