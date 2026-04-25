import { Router } from 'express';
import { MarkSectionSchema } from '@forge/shared';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import * as progressService from '../services/progress';
import { Progress } from '../db/models/progress';
import { Lesson } from '../db/models/lesson';
import { User } from '../db/models/user';
import { HttpError } from '../middleware/errorHandler';
import { toPublicUser } from '../services/auth';

export const progressRouter = Router();

progressRouter.use(requireAuth);

progressRouter.post('/lesson/:lessonId/section', validateBody(MarkSectionSchema), async (req, res, next) => {
  try {
    const out = await progressService.markSectionViewed(req.user!.sub, req.params.lessonId, req.body.sectionKey);
    res.json(out);
  } catch (e) {
    next(e);
  }
});

progressRouter.post('/lesson/:lessonId/complete', async (req, res, next) => {
  try {
    const out = await progressService.completeLesson(req.user!.sub, req.params.lessonId);
    res.json({ xpAwarded: out.xpAwarded, user: toPublicUser(out.user) });
  } catch (e) {
    next(e);
  }
});

progressRouter.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.sub);
    if (!user) throw new HttpError(404, 'user_not_found');
    const totalLessons = await Lesson.countDocuments({});
    const progress = await Progress.find({ userId: user._id }).sort({ lastViewedAt: -1 }).limit(5);
    const recentLessonIds = progress.map((p) => p.lessonId);
    const recentLessons = await Lesson.find({ _id: { $in: recentLessonIds } });
    const lessonMap = new Map(recentLessons.map((l) => [l._id.toString(), l]));

    res.json({
      summary: {
        xp: user.xp,
        level: user.level,
        streak: { current: user.streak?.current ?? 0, longest: user.streak?.longest ?? 0 },
        lessonsCompleted: user.completedLessonIds.length,
        totalLessons,
        weakTopics: user.weakTopics,
        recentActivity: progress
          .map((p) => {
            const l = lessonMap.get(p.lessonId.toString());
            return l
              ? {
                  lessonSlug: l.slug,
                  lessonTitle: l.title,
                  at: p.lastViewedAt.toISOString(),
                }
              : null;
          })
          .filter((x): x is { lessonSlug: string; lessonTitle: string; at: string } => x !== null),
      },
    });
  } catch (e) {
    next(e);
  }
});
