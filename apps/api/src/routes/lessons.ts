import { Router } from 'express';
import { Lesson } from '../db/models/lesson';
import { HttpError } from '../middleware/errorHandler';

export const lessonsRouter = Router();

lessonsRouter.get('/:slug', async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.slug });
    if (!lesson) throw new HttpError(404, 'lesson_not_found');
    res.json({
      lesson: {
        id: lesson._id.toString(),
        slug: lesson.slug,
        title: lesson.title,
        moduleId: lesson.moduleId.toString(),
        order: lesson.order,
        estimatedMinutes: lesson.estimatedMinutes,
        xpReward: lesson.xpReward,
        authored: lesson.authored,
        sections: lesson.sections,
      },
    });
  } catch (e) {
    next(e);
  }
});
