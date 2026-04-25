# Engineer Forge — System Design

> **Mission**: take a beginner or intermediate learner to Software Engineer L1 (Google L3-equivalent) through a curriculum focused on JavaScript / TypeScript / Node.js, system design, and CS fundamentals — with real evaluation, not just lectures.

---

## 1. High-level architecture

```
                         ┌───────────────────────────────────────┐
                         │              CDN (Vercel)             │
                         │  static assets, ISR, image optimization│
                         └────────────────┬──────────────────────┘
                                          │
                                          ▼
          ┌─────────────────────────────────────────────────────────┐
          │   Next.js 14 (App Router, React Server Components)      │
          │   - Landing, auth, dashboard, courses, lessons, quizzes │
          │   - Zustand for client-only UI state (theme, streak)    │
          │   - In-browser JS/TS runner (Web Worker, iframe sandbox)│
          └────────────────┬──────────────────────┬─────────────────┘
                           │ HTTPS                │ WebSocket (v2)
                           ▼                      ▼
          ┌─────────────────────────────────────────────────────────┐
          │     API Gateway (Express + TypeScript)                  │
          │     - JWT auth middleware, role guard                   │
          │     - Rate limiter (redis), request validator (zod)     │
          │     - Routes: /auth /users /courses /lessons /progress  │
          │               /quiz /submissions /certificates /admin   │
          └───┬─────────────┬──────────────┬──────────────┬─────────┘
              │             │              │              │
              ▼             ▼              ▼              ▼
         ┌────────┐    ┌─────────┐    ┌─────────┐    ┌────────────┐
         │MongoDB │    │  Redis  │    │ Object  │    │  Code-exec │
         │(primary│    │ (cache, │    │ Store   │    │   Service  │
         │  OLTP) │    │ session,│    │ (S3)    │    │ (v2: Docker│
         │        │    │ streaks)│    │ certs   │    │  isolate-vm)│
         └────────┘    └─────────┘    └─────────┘    └────────────┘
```

### Why these choices

| Concern            | Decision                                                                 | Rationale                                                                                 |
|--------------------|--------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Frontend framework | Next.js 14 (App Router)                                                  | RSC for fast course rendering, ISR for public pages, first-class TS, easy Vercel deploy.  |
| Styling            | Tailwind CSS                                                             | Fast iteration, no CSS bikeshedding, dark-mode out of the box.                            |
| State              | Zustand (client), React Server Components (server)                       | Zustand for tiny client state (theme, unsaved editor); server components for data fetch.  |
| Backend            | Express + TS (MVP) — easy path to NestJS in v2                           | Lowest-overhead, explicit routing. NestJS is overkill until we have >~40 endpoints.       |
| Primary DB         | MongoDB (Mongoose)                                                       | Curriculum content is document-shaped (varying fields per section). Fast iteration.       |
| Cache              | Redis                                                                    | Sessions, JWT blacklist, streak counters, leaderboards, rate-limiter buckets.             |
| Code exec (MVP)    | Browser Web Worker + iframe sandbox                                      | Zero server cost, fully isolated, good enough for JS/TS learners.                         |
| Code exec (v2)     | `isolated-vm` or Docker + firecracker microVMs                           | Needed once we support untrusted multi-file runs, Node.js APIs, or network calls.         |
| Auth               | JWT (access + refresh) with httpOnly cookie                              | Stateless, scales horizontally. Refresh token rotation for security.                      |
| Real-time (v2)     | Socket.IO                                                                | Mock interviews, live tutoring, presence in chat app projects.                            |

---

## 2. Data model (MongoDB)

All collections use `_id: ObjectId` and `createdAt` / `updatedAt` timestamps unless noted.

### `users`
```ts
{
  _id, email: string (unique, lowercase),
  passwordHash: string,
  name: string,
  role: 'student' | 'admin',
  xp: number,                     // total XP
  level: 'beginner' | 'engineer' | 'advanced',
  streak: { current: number, longest: number, lastActiveDate: Date },
  badges: string[],               // badge slugs
  completedLessonIds: ObjectId[], // denormalized for dashboard speed
  weakTopics: string[]            // computed nightly from quiz accuracy
}
```
Indexes: `{ email: 1 } unique`, `{ xp: -1 }` for leaderboard.

### `courses`
```ts
{
  _id, slug: string (unique),
  title: string, description: string,
  stage: 1 | 2 | 3 | 4 | 5,        // matches the 5 curriculum stages
  order: number,
  estimatedHours: number,
  icon: string, tags: string[],
  moduleIds: ObjectId[]
}
```

### `modules`
```ts
{
  _id, courseId, slug,
  title, description, order,
  lessonIds: ObjectId[]
}
```

### `lessons`
```ts
{
  _id, moduleId, slug, title, order,
  estimatedMinutes: number,
  sections: {
    simpleExplanation: { body: MDX },
    visual:            { body: MDX, diagramUrl?: string },
    deepBreakdown:     { body: MDX },
    dryRun:            { body: MDX, steps: DryRunStep[] },
    commonMistakes:    { body: MDX },
    interviewQuestions:{ items: InterviewQ[] },
    practiceProblems:  { items: ProblemRef[] },    // → problems collection
    thinkLikeEngineer: { body: MDX }
  },
  xpReward: number
}

type DryRunStep = { code: string; callStack: string[]; heap?: Record<string,unknown>; explanation: string };
type InterviewQ = { company?: string; prompt: string; answer: string; difficulty: 1|2|3 };
```

### `problems`
```ts
{
  _id, slug, title, statementMDX,
  starterCode: { js: string; ts?: string },
  testCases: { name: string; input: unknown[]; expected: unknown; hidden: boolean }[],
  difficulty: 'easy' | 'medium' | 'hard',
  companyTags: string[],
  topicTags: string[],
  timeLimitMs: number,
  memoryLimitMb: number
}
```

### `quizzes`
```ts
{
  _id, lessonId, title,
  questions: {
    type: 'mcq' | 'multi' | 'code-output' | 'short';
    prompt: string;
    choices?: string[];
    correct: number[] | string;
    explanation: string;
    points: number;
  }[],
  timeLimitSec?: number,
  passingPct: number               // default 70
}
```

### `progress`
```ts
{
  _id, userId, lessonId,
  status: 'not-started' | 'in-progress' | 'completed',
  sectionsCompleted: string[],     // section keys viewed
  quizBestPct: number | null,
  timeSpentSec: number,
  lastViewedAt: Date
}
```
Indexes: `{ userId: 1, lessonId: 1 } unique`, `{ userId: 1, status: 1 }`.

### `submissions`
```ts
{
  _id, userId, problemId,
  language: 'js' | 'ts',
  code: string,
  passed: boolean,
  passedCases: number, totalCases: number,
  runtimeMs: number, memoryKb?: number,
  stderr?: string
}
```

### `certificates`
```ts
{
  _id, userId, courseId,
  issuedAt: Date,
  verificationId: string (unique), // e.g. "EF-2026-ABC123"
  skills: string[],
  pdfUrl: string                   // S3
}
```
Indexes: `{ verificationId: 1 } unique`.

---

## 3. API spec (REST, v1)

All routes are prefixed `/api`. JSON in/out. JWT in `Authorization: Bearer` **or** httpOnly cookie.

### Auth
| Method | Path                | Body                                  | Auth | Notes                               |
|--------|---------------------|---------------------------------------|------|-------------------------------------|
| POST   | `/auth/signup`      | `{ email, password, name }`           | —    | Creates user + refresh token.       |
| POST   | `/auth/login`       | `{ email, password }`                 | —    | Returns access + refresh.           |
| POST   | `/auth/refresh`     | `{ refreshToken }`                    | —    | Rotates refresh token.              |
| POST   | `/auth/logout`      | —                                     | user | Revokes refresh token in Redis.     |
| GET    | `/auth/me`          | —                                     | user | Returns user profile.               |

### Courses / lessons (read-only for students)
| GET  | `/courses`                              | list all, filtered by `?stage=`            |
| GET  | `/courses/:slug`                        | course with modules (stubs only)           |
| GET  | `/courses/:courseSlug/modules/:modSlug` | module with lessons (titles + order)       |
| GET  | `/lessons/:slug`                        | full lesson with all 8 sections             |

### Progress
| POST | `/progress/lesson/:lessonId/section` | `{ sectionKey }`                    | user | Marks section viewed.               |
| POST | `/progress/lesson/:lessonId/complete`| —                                   | user | Marks lesson complete, awards XP.   |
| GET  | `/progress/me`                       | —                                   | user | Summary for dashboard.              |

### Quizzes
| GET  | `/quizzes/:lessonId`          | questions (correct answers stripped for students) |
| POST | `/quizzes/:lessonId/submit`   | `{ answers: (number[]|string)[] }` → score + per-question feedback |

### Problems / submissions
| GET  | `/problems/:slug`             | problem + visible test cases                    |
| POST | `/problems/:slug/submit`      | `{ code, language }` → runs hidden cases, returns results |

### Certificates
| POST | `/certificates/issue/:courseId` | user; requires all lessons completed + quizzes passed |
| GET  | `/certificates/verify/:verificationId` | public; returns cert metadata (no auth) |

### Admin
| POST / PUT / DELETE on `/admin/courses`, `/admin/modules`, `/admin/lessons`, `/admin/problems`, `/admin/quizzes` | admin only |

All mutation endpoints are validated with `zod` schemas shared between client and server via `packages/shared`.

---

## 4. Folder structure

```
engineer-forge/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── server.ts                   # Express bootstrap
│   │   │   ├── env.ts                      # zod-validated env
│   │   │   ├── db/
│   │   │   │   ├── connect.ts
│   │   │   │   └── models/{user,course,module,lesson,problem,quiz,progress,submission,certificate}.ts
│   │   │   ├── middleware/{auth,requireRole,errorHandler,rateLimit,validate}.ts
│   │   │   ├── routes/{auth,courses,lessons,progress,quizzes,problems,certificates,admin}.ts
│   │   │   ├── services/{auth,progress,quizGrading,codeRunner,certGen}.ts
│   │   │   └── seed/{curriculum.ts,demoUsers.ts,index.ts}
│   │   └── package.json
│   └── web/
│       ├── app/                            # Next.js App Router
│       │   ├── layout.tsx
│       │   ├── page.tsx                    # landing
│       │   ├── (auth)/{login,signup}/page.tsx
│       │   ├── dashboard/page.tsx
│       │   ├── courses/page.tsx
│       │   ├── courses/[slug]/page.tsx
│       │   ├── lessons/[slug]/page.tsx
│       │   ├── quiz/[lessonId]/page.tsx
│       │   └── verify/[id]/page.tsx
│       ├── components/
│       │   ├── CodeRunner.tsx              # Web Worker sandbox
│       │   ├── LessonTabs.tsx              # 8-section nav
│       │   ├── DryRunViewer.tsx            # call-stack visualizer
│       │   ├── QuizRunner.tsx
│       │   └── ui/*                        # shadcn-style primitives
│       ├── lib/{api,auth,store,xp}.ts
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/{schemas.ts,types.ts,curriculum-map.ts}
│       └── package.json
├── content/courses/core-js/event-loop/*.mdx
├── DESIGN.md
└── README.md
```

---

## 5. Sample implementations (see source)

### 5.1 Auth — `apps/api/src/services/auth.ts`
- `bcrypt.hash(password, 12)` on signup
- JWT access token (15 min) signed with `JWT_SECRET`; refresh token (30 days) stored hashed in Redis keyed by user
- Rotation: refresh returns new pair and invalidates old refresh
- Cookie: `httpOnly`, `secure`, `sameSite=lax`

### 5.2 Course module — `apps/api/src/routes/lessons.ts` + `content/courses/.../event-loop.json`
- Lessons are stored in Mongo, but authored as JSON/MDX in `/content` and imported by the seed script — content lives in git, DB is cache.

### 5.3 Progress tracking — `apps/api/src/services/progress.ts`
- `markSectionViewed(userId, lessonId, sectionKey)` — upserts `progress` doc, adds to `sectionsCompleted` set
- `completeLesson(userId, lessonId)` — requires all 8 section keys + passing quiz; awards `lesson.xpReward` XP; updates streak; computes new level
- Weak-topic detection runs nightly (cron): for each user, group quiz submissions by `lesson.topicTags`, flag tags where avg accuracy < 60%

---

## 6. UI wireframes (text)

### Landing
```
┌────────────────────────────────────────────────────────┐
│  Engineer Forge            Login    Get started →      │
├────────────────────────────────────────────────────────┤
│                                                         │
│   Train like an engineer.  Ship like one.              │
│   A 5-stage curriculum from CS basics → L1-ready.      │
│                                                         │
│   [ Start free ]    [ See curriculum ]                 │
│                                                         │
│   ▣ 5 stages  ▣ 200+ lessons  ▣ 500+ problems          │
│                                                         │
├────────────────────────────────────────────────────────┤
│  Stage 1: Foundations    Stage 2: Core JS    ...       │
│  (card grid)                                            │
└────────────────────────────────────────────────────────┘
```

### Dashboard
```
┌─ Welcome back, Jakuan ───────────────────── 🔥 7-day streak ─┐
│                                                               │
│  XP: 1,240   Level: Engineer    Next: 260 XP to Advanced      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  82%                                │
│                                                               │
│  Continue where you left off                                  │
│  ▸ Core JS → Event Loop → Deep Breakdown (section 3/8)        │
│                                                               │
│  Weak topics: [closures] [Big-O] [hoisting]                   │
│                                                               │
│  Recent activity        Badges                                │
│  • Solved 2 problems    🏅 First PR, 🏅 100-day streak        │
└───────────────────────────────────────────────────────────────┘
```

### Lesson viewer
```
┌─ Event Loop ──────────────────────────────────────────── 45m ─┐
│ [Simple][Visual][Deep][DryRun][Mistakes][Interview][Practice] │
│                                                               │
│  <rendered MDX>                                               │
│                                                               │
│  ── Code runner ──────────────────────────────────────────    │
│  1 │ console.log('a');                           [ ▶ Run ]   │
│  2 │ setTimeout(() => console.log('b'), 0);                   │
│  3 │ Promise.resolve().then(() => console.log('c'));          │
│                                                               │
│  Output: a  c  b                                              │
│  Call stack + task queues (live diagram)                      │
└───────────────────────────────────────────────────────────────┘
```

---

## 7. Scaling strategy

| Stage        | Users  | Approach                                                                          |
|--------------|--------|-----------------------------------------------------------------------------------|
| 0 → 1k       | MVP    | Single API instance on Fly.io / Render. MongoDB Atlas M0. Redis Cloud free.       |
| 1k → 100k    | Growth | Vercel for web (scales automatically). API → Fly.io / AWS ECS behind ALB, 3 instances min, autoscale on CPU. Atlas M20 with read replicas. |
| 100k → 1M    | Scale  | Split API into services: auth, content, submissions, gamification. Content CDN-cached (lessons are immutable per version). Mongo sharded by `userId` for `progress` / `submissions`. Redis cluster. Code-exec → dedicated pool of firecracker VMs, queue via SQS. |
| 1M+          | Enterprise | Multi-region active-passive; pgBouncer-style connection pooler in front of Mongo; dedicated leaderboard service (Redis sorted sets + periodic persistence); search via Elasticsearch. |

### Caching strategy
- **Course/module/lesson reads** → Redis, keyed by `lesson:{slug}:v{contentVersion}`, TTL 1 day, invalidated on admin update (bump version).
- **Public pages** (landing, curriculum, verify cert) → Vercel ISR, revalidate 1h.
- **User progress** → write-through to Mongo, read-through from Redis (5m TTL).
- **Leaderboard** → Redis `ZADD leaderboard:xp <xp> <userId>`, top-100 page cached 60s.

### Code execution (v2)
- Queue submissions to SQS. Workers pull, spawn `isolated-vm` per job with 256MB/2s limits.
- For untrusted Node runs: firecracker microVMs with network disabled, rootfs from immutable image, killed on timeout.
- Test cases split into visible (returned to user) + hidden (scored only). Anti-cheat: randomize case order, obfuscate hidden inputs.

### Security
- httpOnly secure cookies for auth; CSRF tokens on state-changing endpoints.
- Content-Security-Policy blocks inline scripts except the sandboxed iframe (which runs with `sandbox="allow-scripts"` only).
- Rate limiting: 100 req/min/user on reads, 10 req/min on submissions, 5 req/min on auth.
- Secrets in vault (Fly secrets / AWS SSM). No secrets in frontend bundle.

---

## 8. Learning-model enforcement

The 8-section structure is enforced at the schema level — `lessons.sections` has exactly 8 keys, all required at publish time. The admin dashboard shows a completeness bar per lesson and blocks publish if any section is empty. This is the **single most important product rule**: a lesson isn't real until all 8 sections exist.

---

## 9. Roadmap

**v1 (this release)** — Scaffold + "Event Loop" module fully authored; rest stubbed.
**v1.1** — Full Stage 2 (Core JavaScript) content.
**v1.2** — Code-execution service (isolated-vm) for Node APIs.
**v2.0** — AI mentor (streams explanations via OpenAI), WebSocket mock-interview rooms, resume + portfolio generator.
**v2.1** — System-design interactive whiteboard (draw → auto-critique).
**v3.0** — Paid tier with live cohort sessions, 1-on-1 mentor matching.
