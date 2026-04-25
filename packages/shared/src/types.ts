import type { SectionKey } from './schemas';

export type Role = 'student' | 'admin';
export type Level = 'beginner' | 'engineer' | 'advanced';

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  role: Role;
  xp: number;
  level: Level;
  streak: { current: number; longest: number };
  badges: string[];
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  stage: 1 | 2 | 3 | 4 | 5;
  order: number;
  estimatedHours: number;
  icon: string;
  tags: string[];
  moduleCount: number;
  lessonCount: number;
}

export interface ModuleSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: { id: string; slug: string; title: string; order: number; estimatedMinutes: number }[];
}

export interface DryRunStep {
  code: string;
  callStack: string[];
  microtaskQueue?: string[];
  macrotaskQueue?: string[];
  heap?: Record<string, unknown>;
  explanation: string;
}

export interface InterviewQuestion {
  company?: string;
  prompt: string;
  answer: string;
  difficulty: 1 | 2 | 3;
}

export interface ProblemRef {
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonSections {
  simpleExplanation: { body: string };
  visual: { body: string; diagramUrl?: string };
  deepBreakdown: { body: string };
  dryRun: { body: string; steps: DryRunStep[] };
  commonMistakes: { body: string };
  interviewQuestions: { items: InterviewQuestion[] };
  practiceProblems: { items: ProblemRef[] };
  thinkLikeEngineer: { body: string };
}

export interface LessonFull {
  id: string;
  slug: string;
  title: string;
  moduleId: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  sections: LessonSections;
}

export interface QuizQuestionPublic {
  type: 'mcq' | 'multi' | 'code-output' | 'short';
  prompt: string;
  choices?: string[];
  points: number;
}

export interface QuizPublic {
  id: string;
  lessonId: string;
  title: string;
  timeLimitSec?: number;
  passingPct: number;
  questions: QuizQuestionPublic[];
}

export interface QuizResult {
  score: number;
  total: number;
  pct: number;
  passed: boolean;
  perQuestion: { correct: boolean; explanation: string }[];
  xpAwarded: number;
}

export interface ProgressSummary {
  xp: number;
  level: Level;
  streak: { current: number; longest: number };
  lessonsCompleted: number;
  totalLessons: number;
  weakTopics: string[];
  recentActivity: { lessonSlug: string; lessonTitle: string; at: string }[];
}

export const SECTION_ORDER: SectionKey[] = [
  'simpleExplanation',
  'visual',
  'deepBreakdown',
  'dryRun',
  'commonMistakes',
  'interviewQuestions',
  'practiceProblems',
  'thinkLikeEngineer',
];

export const SECTION_LABEL: Record<SectionKey, string> = {
  simpleExplanation: 'Simple Explanation',
  visual: 'Visual',
  deepBreakdown: 'Deep Breakdown',
  dryRun: 'Dry Run',
  commonMistakes: 'Common Mistakes',
  interviewQuestions: 'Interview Questions',
  practiceProblems: 'Practice Problems',
  thinkLikeEngineer: 'Think Like an Engineer',
};
