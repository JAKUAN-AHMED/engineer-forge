/**
 * Full curriculum map. This is the source-of-truth for the 5-stage structure.
 * Lessons marked `authored: true` have full content in /content.
 * Everything else is seeded as stub (title + placeholder sections) and will be
 * authored in follow-up releases.
 */

export interface CurriculumLesson {
  slug: string;
  title: string;
  estimatedMinutes: number;
  authored?: boolean;
}

export interface CurriculumModule {
  slug: string;
  title: string;
  description: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumCourse {
  slug: string;
  title: string;
  description: string;
  stage: 1 | 2 | 3 | 4 | 5;
  order: number;
  estimatedHours: number;
  icon: string;
  tags: string[];
  modules: CurriculumModule[];
}

export const CURRICULUM: CurriculumCourse[] = [
  // ─────────────── Stage 1: Foundations ───────────────
  {
    slug: 'cs-foundations',
    title: 'CS Foundations',
    description: 'How computers actually work: CPU, memory, processes, execution model.',
    stage: 1,
    order: 1,
    estimatedHours: 12,
    icon: 'cpu',
    tags: ['cs', 'fundamentals'],
    modules: [
      {
        slug: 'how-computers-work',
        title: 'How Computers Work',
        description: 'From silicon to your code.',
        lessons: [
          { slug: 'cpu-memory-processes', title: 'CPU, Memory, and Processes', estimatedMinutes: 30 },
          { slug: 'js-engine-internals', title: 'JS Engine Internals (V8)', estimatedMinutes: 35 },
          { slug: 'call-stack-intro', title: 'The Call Stack', estimatedMinutes: 25 },
        ],
      },
      {
        slug: 'complexity',
        title: 'Time & Space Complexity',
        description: 'Big-O that actually makes sense.',
        lessons: [
          { slug: 'big-o-basics', title: 'Big-O Basics', estimatedMinutes: 30 },
          { slug: 'common-complexities', title: 'Common Complexity Classes', estimatedMinutes: 25 },
          { slug: 'space-complexity', title: 'Space Complexity', estimatedMinutes: 20 },
        ],
      },
      {
        slug: 'data-structures',
        title: 'Core Data Structures',
        description: 'Arrays, hashmaps, stacks, queues, lists, trees, graphs.',
        lessons: [
          { slug: 'arrays-strings', title: 'Arrays & Strings', estimatedMinutes: 30 },
          { slug: 'stack-queue', title: 'Stack & Queue', estimatedMinutes: 30 },
          { slug: 'linked-list', title: 'Linked List', estimatedMinutes: 35 },
          { slug: 'hashmap', title: 'HashMap', estimatedMinutes: 35 },
          { slug: 'trees-bst', title: 'Trees & BST', estimatedMinutes: 40 },
          { slug: 'graph-basics', title: 'Graph Basics', estimatedMinutes: 40 },
        ],
      },
    ],
  },

  // ─────────────── Stage 2: Core JavaScript ───────────────
  {
    slug: 'core-javascript',
    title: 'Core JavaScript',
    description: 'Deep understanding of JavaScript — not just syntax.',
    stage: 2,
    order: 2,
    estimatedHours: 18,
    icon: 'javascript',
    tags: ['javascript', 'language'],
    modules: [
      {
        slug: 'execution-model',
        title: 'Execution Model',
        description: 'How JS actually runs your code.',
        lessons: [
          { slug: 'execution-context-scope', title: 'Execution Context & Scope', estimatedMinutes: 35 },
          { slug: 'hoisting', title: 'Hoisting', estimatedMinutes: 25 },
          { slug: 'closures', title: 'Closures (with memory model)', estimatedMinutes: 45 },
          { slug: 'prototypes-inheritance', title: 'Prototypes & Inheritance', estimatedMinutes: 40 },
          { slug: 'this-binding', title: '`this` binding, call/apply/bind', estimatedMinutes: 35 },
        ],
      },
      {
        slug: 'async',
        title: 'Async JavaScript',
        description: 'Callbacks → Promises → async/await → event loop deep dive.',
        lessons: [
          { slug: 'callbacks', title: 'Callbacks', estimatedMinutes: 25 },
          { slug: 'promises', title: 'Promises', estimatedMinutes: 35 },
          { slug: 'async-await', title: 'async / await', estimatedMinutes: 30 },
          { slug: 'event-loop', title: 'The Event Loop (micro/macrotasks)', estimatedMinutes: 50, authored: true },
          { slug: 'error-handling', title: 'Error handling patterns', estimatedMinutes: 25 },
        ],
      },
    ],
  },

  // ─────────────── Stage 3: TypeScript + Backend ───────────────
  {
    slug: 'typescript-node',
    title: 'TypeScript + Node.js',
    description: 'Ship real backends with types.',
    stage: 3,
    order: 3,
    estimatedHours: 22,
    icon: 'typescript',
    tags: ['typescript', 'node', 'backend'],
    modules: [
      {
        slug: 'typescript',
        title: 'TypeScript',
        description: 'Types, generics, and project structure.',
        lessons: [
          { slug: 'ts-type-system', title: 'The Type System', estimatedMinutes: 40 },
          { slug: 'interfaces-types', title: 'Interfaces & Types', estimatedMinutes: 30 },
          { slug: 'generics', title: 'Generics', estimatedMinutes: 40 },
          { slug: 'project-structure', title: 'Modular Project Structure', estimatedMinutes: 30 },
        ],
      },
      {
        slug: 'node-backend',
        title: 'Node.js Backend',
        description: 'REST, auth, database, caching.',
        lessons: [
          { slug: 'rest-api-design', title: 'REST API Design', estimatedMinutes: 40 },
          { slug: 'auth-jwt-oauth', title: 'Auth: JWT, OAuth, Firebase', estimatedMinutes: 50 },
          { slug: 'mongodb-mongoose', title: 'MongoDB + Mongoose', estimatedMinutes: 40 },
          { slug: 'postgres-basics', title: 'PostgreSQL basics', estimatedMinutes: 35 },
          { slug: 'redis-caching', title: 'Redis caching', estimatedMinutes: 30 },
          { slug: 'scalability-intro', title: 'Scalability concepts', estimatedMinutes: 40 },
        ],
      },
    ],
  },

  // ─────────────── Stage 4: System Design ───────────────
  {
    slug: 'system-design',
    title: 'System Design (Beginner → Intermediate)',
    description: 'How real backend systems scale.',
    stage: 4,
    order: 4,
    estimatedHours: 16,
    icon: 'network',
    tags: ['system-design'],
    modules: [
      {
        slug: 'building-blocks',
        title: 'Building Blocks',
        description: 'Load balancing, caching, indexing, API design.',
        lessons: [
          { slug: 'scaling-basics', title: 'How Backends Scale', estimatedMinutes: 40 },
          { slug: 'load-balancing', title: 'Load Balancing', estimatedMinutes: 35 },
          { slug: 'caching-strategies', title: 'Caching Strategies', estimatedMinutes: 35 },
          { slug: 'db-indexing', title: 'Database Indexing', estimatedMinutes: 35 },
          { slug: 'api-design-best-practices', title: 'API Design Best Practices', estimatedMinutes: 35 },
        ],
      },
      {
        slug: 'case-studies',
        title: 'Real-world Case Studies',
        description: 'Design real systems.',
        lessons: [
          { slug: 'design-url-shortener', title: 'Design: URL Shortener', estimatedMinutes: 45 },
          { slug: 'design-social-feed', title: 'Design: Social Media Feed', estimatedMinutes: 50 },
          { slug: 'design-chat-system', title: 'Design: Chat System', estimatedMinutes: 50 },
        ],
      },
    ],
  },

  // ─────────────── Stage 5: Interview Prep ───────────────
  {
    slug: 'interview-prep',
    title: 'Interview Preparation',
    description: 'DSA, tricky JS, machine coding, behavioral, mocks.',
    stage: 5,
    order: 5,
    estimatedHours: 25,
    icon: 'target',
    tags: ['interview'],
    modules: [
      {
        slug: 'dsa',
        title: 'DSA Problem Sets',
        description: 'Company-tagged, curated for L1 interviews.',
        lessons: [
          { slug: 'dsa-arrays', title: 'Array problems (Google, Meta)', estimatedMinutes: 60 },
          { slug: 'dsa-strings', title: 'String problems', estimatedMinutes: 60 },
          { slug: 'dsa-hashmap', title: 'Hashmap problems', estimatedMinutes: 60 },
          { slug: 'dsa-trees', title: 'Tree problems', estimatedMinutes: 60 },
        ],
      },
      {
        slug: 'js-tricky',
        title: 'Tricky JavaScript',
        description: 'The questions that trip up everyone.',
        lessons: [
          { slug: 'output-based-qs', title: 'Output-based questions', estimatedMinutes: 45 },
          { slug: 'polyfills', title: 'Write polyfills (bind, map, debounce)', estimatedMinutes: 60 },
        ],
      },
      {
        slug: 'machine-coding',
        title: 'Machine Coding Challenges',
        description: 'Build a small app in 90 minutes.',
        lessons: [
          { slug: 'todo-app-mc', title: 'Build: Todo app', estimatedMinutes: 90 },
          { slug: 'infinite-scroll-mc', title: 'Build: Infinite scroll list', estimatedMinutes: 90 },
        ],
      },
      {
        slug: 'behavioral',
        title: 'Behavioral + Mocks',
        description: 'STAR framework, common questions, mock interviews.',
        lessons: [
          { slug: 'star-framework', title: 'The STAR framework', estimatedMinutes: 30 },
          { slug: 'behavioral-bank', title: '30 common behavioral questions', estimatedMinutes: 45 },
          { slug: 'mock-interview-runbook', title: 'Running a mock interview', estimatedMinutes: 30 },
        ],
      },
    ],
  },
];

export function countLessons(c: CurriculumCourse): number {
  return c.modules.reduce((a, m) => a + m.lessons.length, 0);
}
