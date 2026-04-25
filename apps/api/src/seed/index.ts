import { connectDb, disconnectDb } from '../db/connect';
import { User } from '../db/models/user';
import { Course } from '../db/models/course';
import { LessonModule } from '../db/models/module';
import { Lesson } from '../db/models/lesson';
import { Quiz } from '../db/models/quiz';
import { Progress } from '../db/models/progress';
import { Certificate } from '../db/models/certificate';
import type {
  CurriculumCourse,
  CurriculumModule,
  CurriculumLesson,
  DryRunStep,
  InterviewQuestion,
  ProblemRef,
  LessonSections,
} from '@forge/shared';
import { CURRICULUM, SECTION_ORDER } from '@forge/shared';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

function slugToFunctionName(slug: string) {
  return slug.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).map((word, index) => index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1)).join('') || 'example';
}

function createPracticeProblems(title: string, slug: string) {
  const topic = title.replace(/`/g, '');
  return [
    {
      slug: `${slug}-summary`,
      title: `Summarize the main purpose of ${topic}`,
      difficulty: 'easy' as const,
    },
    {
      slug: `${slug}-scenario`,
      title: `Describe one real-world problem that ${topic.toLowerCase()} solves`,
      difficulty: 'medium' as const,
    },
    {
      slug: `${slug}-improvement`,
      title: `Explain a tradeoff or optimization related to ${topic.toLowerCase()}`,
      difficulty: 'hard' as const,
    },
  ];
}

function createInterviewQuestions(title: string, stage: number) {
  const topic = title.replace(/`/g, '');
  return [
    {
      company: 'Forge Institute',
      prompt: `How do you explain ${topic} to a teammate who is new to this concept?`,
      answer: `Start with the problem it solves, then describe the main steps and a brief example. For ${topic}, focus on the expected outcome, the key rules, and why this approach is more reliable than a simpler alternative.`, 
      difficulty: 1 as const,
    },
    {
      company: 'Interview Labs',
      prompt: `What is one common mistake engineers make when implementing ${topic.toLowerCase()}?`,
      answer: `The most common pitfall is assuming the wrong input shape or forgetting to handle edge cases. Always validate inputs, check ordering, and reason through how the system changes state during execution.`, 
      difficulty: 2 as const,
    },
    {
      company: 'Engineering Teams',
      prompt: `When would you choose ${topic.toLowerCase()} over a simpler alternative?`,
      answer: `Choose this approach when correctness, maintainability, or performance matter more than a quick hack. For ${topic}, the right choice is usually the one that makes the system easier to reason about and less likely to fail under edge conditions.`, 
      difficulty: stage >= 4 ? 3 as const : 2 as const,
    },
  ];
}

function createDryRunSteps(title: string, slug: string) {
  const fnName = slugToFunctionName(slug);
  return [
    {
      code: `function ${fnName}(values) {
  const doubled = values.map((value) => value * 2);
  const filtered = doubled.filter((value) => value % 3 !== 0);
  return filtered;
}

console.log(${fnName}([1, 2, 3, 4]));`,
      callStack: ['global', `${fnName}`],
      microtaskQueue: [],
      macrotaskQueue: [],
      heap: { values: [1, 2, 3, 4], doubled: [2, 4, 6, 8], filtered: [2, 4, 8] },
      explanation: `Trace the function step by step: input values are doubled, the result is filtered for items that are not divisible by 3, and the final array is returned. This teaches you to follow state changes clearly when ${title.toLowerCase()} is involved.`,
    },
    {
      code: `// Example: how the output is built
const input = [1, 2, 3, 4];
const doubled = input.map((value) => value * 2);
const output = doubled.filter((value) => value % 3 !== 0);
console.log(output);`,
      callStack: ['global'],
      microtaskQueue: [],
      macrotaskQueue: [],
      heap: { input: [1, 2, 3, 4], doubled: [2, 4, 6, 8], output: [2, 4, 8] },
      explanation: `Follow the heap values and see how each step transforms the data. This makes it easier to verify the expected behavior and spot errors in the logic.`,
    },
  ] satisfies DryRunStep[];
}

function createCommonMistakes(title: string) {
  const topic = title.replace(/`/g, '').toLowerCase();
  return `- Treating ${topic} as a single-step action instead of a process with multiple phases.
- Forgetting to validate or sanitize inputs before applying the main logic.
- Ignoring how changes in data shape or execution order affect the final result.`;
}

function createQuizContent(title: string) {
  const topic = title.replace(/`/g, '');
  return {
    title: `${topic} Knowledge Check`,
    passingPct: 70,
    questions: [
      {
        prompt: `Which of the following best describes the core utility of ${topic}?`,
        type: 'mcq' as const,
        points: 10,
        choices: [
          `It is primarily used for CSS formatting and browser painting.`,
          `It manages internal data representations and execution sequences.`,
          `It acts solely as a persistent database layer.`,
          `It replaces the need for continuous integration testing.`
        ],
        correct: [1],
        explanation: `${topic} fundamentally deals with managing logic, data sequences, or system state in the engineering workflow.`
      },
      {
        prompt: `Select all the common pitfalls engineers face when implementing ${topic}:`,
        type: 'multi' as const,
        points: 10,
        choices: [
          `Ignoring input validation and edge cases.`,
          `Writing too many inline comments.`,
          `Failing to update package-lock.json.`,
          `Not understanding how order of execution affects the overall state.`
        ],
        correct: [0, 3],
        explanation: 'Failing to parse the execution flow and missing edge cases are the most critical architectural pitfalls.'
      }
    ]
  };
}

function createLessonSections(lesson: CurriculumLesson, module: CurriculumModule, course: CurriculumCourse): LessonSections {
  const topic = lesson.title.replace(/`/g, '');
  const moduleContext = module.title;
  const courseContext = course.title;
  const simpleBody = `This lesson explains **${topic}** inside the ${courseContext} program. You will learn what ${topic} means, why it matters, and how it fits into the larger workflow of ${moduleContext.toLowerCase()}.`;
  const visualBody = `Picture ${topic.toLowerCase()} as a flow of data through one or more components. Focus on the inputs, the transformation points, and the final output, then imagine this flow as a diagram or wireframe.`;
  const deepBody = `A deeper breakdown of ${topic} covers the core rules, the most important edge cases, and the decisions engineers make when they use it. Review the concept through these lenses:

- What it does in practice
- How the underlying mechanism works
- When to use it versus another approach`;
  const thinkBody = `Think like an engineer: define the intended outcome first, then verify each step with examples. For ${topic}, that means checking the assumptions, understanding side effects, and making the behaviour predictable.`;

  const stageHint = course.stage >= 4
    ? 'This concept also appears in system design and architecture discussions, not just code.'
    : 'This is a practical concept you will use directly as a developer.';

  return {
    simpleExplanation: { body: `${simpleBody} ${stageHint}` },
    visual: {
      body: `${visualBody}

Use diagrams, highlights, or call stacks to make the idea feel concrete and visible. Visual thinking is often the fastest way to understand why this concept matters.`,
    },
    deepBreakdown: {
      body: `${deepBody}

This section helps you move from surface understanding to confident use, with a focus on the 'why' behind each decision.`,
    },
    dryRun: {
      body: `Walk through a concrete example of ${topic} with a small, predictable input. Track the values that change, observe the intermediate state, and confirm the final output step by step.`,
      steps: createDryRunSteps(lesson.title, lesson.slug),
    },
    commonMistakes: {
      body: `${createCommonMistakes(lesson.title)}

Use this checklist when you audit your own solutions for reliability and maintainability.`,
    },
    interviewQuestions: { items: createInterviewQuestions(lesson.title, course.stage) },
    practiceProblems: { items: createPracticeProblems(lesson.title, lesson.slug) },
    thinkLikeEngineer: {
      body: `${thinkBody} Then ask yourself: what assumptions did I make, and how would I explain this to a teammate?`,
    },
  };
}

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
        const sections = isAuthored ? eventLoopContent.sections : createLessonSections(l, m, c);
        const lesson = await Lesson.create({
          moduleId: mod._id,
          slug: l.slug,
          title: isAuthored ? eventLoopContent.title : l.title,
          order: m.lessons.indexOf(l) + 1,
          estimatedMinutes: l.estimatedMinutes,
          xpReward: isAuthored ? eventLoopContent.xpReward : 70,
          sections,
          authored: true,
        });
        lessonIds.push(lesson._id);

        if (isAuthored && eventLoopContent.quiz) {
          await Quiz.create({
            lessonId: lesson._id,
            title: eventLoopContent.quiz.title,
            passingPct: eventLoopContent.quiz.passingPct,
            questions: eventLoopContent.quiz.questions,
          });
        } else {
          const generatedQuiz = createQuizContent(lesson.title);
          await Quiz.create({
            lessonId: lesson._id,
            title: generatedQuiz.title,
            passingPct: generatedQuiz.passingPct,
            questions: generatedQuiz.questions,
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
