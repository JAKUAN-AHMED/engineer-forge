import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase()),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(80),
});
export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase()),
  password: z.string().min(1).max(128),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const SectionKey = z.enum([
  'simpleExplanation',
  'visual',
  'deepBreakdown',
  'dryRun',
  'commonMistakes',
  'interviewQuestions',
  'practiceProblems',
  'thinkLikeEngineer',
]);
export type SectionKey = z.infer<typeof SectionKey>;

export const MarkSectionSchema = z.object({
  sectionKey: SectionKey,
});

export const QuizAnswerSchema = z.union([
  z.array(z.number().int().nonnegative()),
  z.string().max(2000),
]);

export const QuizSubmitSchema = z.object({
  answers: z.array(QuizAnswerSchema),
});
export type QuizSubmitInput = z.infer<typeof QuizSubmitSchema>;

export const SubmissionSchema = z.object({
  code: z.string().min(1).max(50_000),
  language: z.enum(['js', 'ts']),
});
export type SubmissionInput = z.infer<typeof SubmissionSchema>;
