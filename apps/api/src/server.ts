import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './env';
import { connectDb } from './db/connect';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { coursesRouter } from './routes/courses';
import { lessonsRouter } from './routes/lessons';
import { progressRouter } from './routes/progress';
import { quizzesRouter } from './routes/quizzes';
import { certificatesRouter } from './routes/certificates';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '200kb' }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  );

  const readLimiter = rateLimit({ windowMs: 60_000, limit: 200, standardHeaders: true, legacyHeaders: false });
  const writeLimiter = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false });

  app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

  app.use('/api/auth', writeLimiter, authRouter);
  app.use('/api/courses', readLimiter, coursesRouter);
  app.use('/api/lessons', readLimiter, lessonsRouter);
  app.use('/api/progress', writeLimiter, progressRouter);
  app.use('/api/quizzes', writeLimiter, quizzesRouter);
  app.use('/api/certificates', writeLimiter, certificatesRouter);

  app.use(errorHandler);
  return app;
}

async function main() {
  await connectDb();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT}`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error('[api] fatal:', err);
    process.exit(1);
  });
}
