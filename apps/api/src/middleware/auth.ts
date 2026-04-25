import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';
import { HttpError } from './errorHandler';

export interface AuthPayload {
  sub: string;
  role: 'student' | 'admin';
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
  if (!token) {
    next(new HttpError(401, 'unauthenticated'));
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    next(new HttpError(401, 'invalid_token'));
  }
};

export const requireRole =
  (role: 'admin' | 'student'): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      next(new HttpError(401, 'unauthenticated'));
      return;
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      next(new HttpError(403, 'forbidden'));
      return;
    }
    next();
  };
