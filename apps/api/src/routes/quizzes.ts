import { Router } from 'express';
import { QuizSubmitSchema } from '@forge/shared';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { Quiz } from '../db/models/quiz';
import { HttpError } from '../middleware/errorHandler';
import { gradeQuiz } from '../services/quizGrading';
import { User } from '../db/models/user';

export const quizzesRouter = Router();

quizzesRouter.get('/:lessonId', async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    if (!quiz) throw new HttpError(404, 'quiz_not_found');
    res.json({
      quiz: {
        id: quiz._id.toString(),
        lessonId: quiz.lessonId.toString(),
        title: quiz.title,
        timeLimitSec: quiz.timeLimitSec,
        passingPct: quiz.passingPct,
        questions: quiz.questions.map((q) => ({
          type: q.type,
          prompt: q.prompt,
          choices: q.choices,
          points: q.points,
        })),
      },
    });
  } catch (e) {
    next(e);
  }
});

quizzesRouter.post('/:lessonId/submit', requireAuth, validateBody(QuizSubmitSchema), async (req, res, next) => {
  try {
    const result = await gradeQuiz(req.user!.sub, req.params.lessonId, req.body);
    if (result.xpAwarded > 0) {
      await User.updateOne({ _id: req.user!.sub }, { $inc: { xp: result.xpAwarded } });
    }
    res.json(result);
  } catch (e) {
    next(e);
  }
});
