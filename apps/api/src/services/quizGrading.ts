import { Quiz } from '../db/models/quiz';
import { Progress } from '../db/models/progress';
import type { QuizSubmitInput } from '@forge/shared';
import { HttpError } from '../middleware/errorHandler';

export async function gradeQuiz(
  userId: string,
  lessonId: string,
  input: QuizSubmitInput,
): Promise<{
  score: number;
  total: number;
  pct: number;
  passed: boolean;
  perQuestion: { correct: boolean; explanation: string }[];
  xpAwarded: number;
}> {
  const quiz = await Quiz.findOne({ lessonId });
  if (!quiz) throw new HttpError(404, 'quiz_not_found');
  if (input.answers.length !== quiz.questions.length) {
    throw new HttpError(400, 'answer_count_mismatch');
  }

  let score = 0;
  let total = 0;
  const perQuestion: { correct: boolean; explanation: string }[] = [];

  quiz.questions.forEach((q, i) => {
    total += q.points;
    const given = input.answers[i];
    let correct = false;

    if (q.type === 'mcq' || q.type === 'multi') {
      const expected = (q.correct as number[]) ?? [];
      const got = Array.isArray(given) ? (given as number[]) : [];
      correct =
        expected.length === got.length &&
        expected.every((v) => got.includes(v)) &&
        got.every((v) => expected.includes(v));
    } else {
      const expected = String(q.correct).trim().toLowerCase();
      const got = String(given).trim().toLowerCase();
      correct = expected === got;
    }

    if (correct) score += q.points;
    perQuestion.push({ correct, explanation: q.explanation });
  });

  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const passed = pct >= quiz.passingPct;

  // Track best score on progress
  const prev = await Progress.findOne({ userId, lessonId });
  const prevBest = prev?.quizBestPct ?? 0;
  const bestPct = Math.max(prevBest, pct);
  await Progress.findOneAndUpdate(
    { userId, lessonId },
    { $set: { quizBestPct: bestPct, lastViewedAt: new Date() } },
    { upsert: true },
  );

  const xpAwarded = passed && (prev?.quizBestPct ?? 0) < quiz.passingPct ? 25 : 0;

  return { score, total, pct, passed, perQuestion, xpAwarded };
}
