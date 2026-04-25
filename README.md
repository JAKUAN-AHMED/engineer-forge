# Engineer Forge

> An industry-grade training platform that takes beginner / intermediate learners to **Software Engineer L1** (L3-equivalent at Google) through a structured curriculum of **JavaScript, TypeScript, Node.js, System Design, and CS fundamentals**.

Not a tutorial site. A **training environment** that teaches, evaluates, and certifies.

## Highlights

- **5-stage curriculum**: CS Foundations → Core JS → TS + Node → System Design → Interview Prep
- **8-section learning model** per topic (explanation, visual, deep breakdown, dry-run, common mistakes, interview Qs, practice, "Think Like an Engineer")
- **In-browser JS/TS runner** in a sandboxed Web Worker (no Docker needed for MVP)
- **Auto-evaluated quizzes** + **coding challenges** with hidden test cases
- **Personalized dashboard** — progress, accuracy, streak, XP, weak areas
- **Verifiable certificates** with unique verification IDs
- **Role-based**: student + admin

## Monorepo layout

```
engineer-forge/
├── apps/
│   ├── api/              # Express + TS + Mongoose (REST API)
│   └── web/              # Next.js 14 (App Router) + TS + Tailwind
├── packages/
│   └── shared/           # Shared TS types + zod schemas
├── content/
│   └── courses/          # Course content (JSON + MDX)
├── DESIGN.md             # Full system design document
└── README.md
```

## Quick start

```bash
# 1. Install deps
npm install

# 2. Start MongoDB (local or Atlas)
export MONGO_URI="mongodb://localhost:27017/engineer-forge"
export JWT_SECRET="change-me"

# 3. Seed curriculum + demo users
npm run seed

# 4. Run both apps (in separate terminals)
npm run dev:api    # http://localhost:4000
npm run dev:web    # http://localhost:3000
```

Demo accounts (after seed):

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Student | `student@forge.dev` | `password` |
| Admin   | `admin@forge.dev`   | `password` |

## Documentation

See [`DESIGN.md`](./DESIGN.md) for the full architecture, schema, API spec, and scaling strategy.

## Status

**v1 (this release)** — MVP scaffold, one fully-authored module ("JavaScript Event Loop"), structure for all others.

**v2 (roadmap)** — AI mentor, Docker sandbox, WebSocket real-time, OAuth, resume generator, full curriculum content, mock interviews.

## License

MIT
