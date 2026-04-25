import { Router } from 'express';
import { SignupSchema, LoginSchema } from '@forge/shared';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import * as authService from '../services/auth';
import { User, type UserDoc } from '../db/models/user';
import { HttpError } from '../middleware/errorHandler';

export const authRouter = Router();

function setRefreshCookie(res: import('express').Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
}

authRouter.post('/signup', validateBody(SignupSchema), async (req, res, next) => {
  try {
    const { user, tokens } = await authService.signup(req.body);
    setRefreshCookie(res, tokens.refreshToken);
    res.status(201).json({ user: authService.toPublicUser(user), accessToken: tokens.accessToken });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', validateBody(LoginSchema), async (req, res, next) => {
  try {
    const { user, tokens } = await authService.login(req.body);
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user: authService.toPublicUser(user), accessToken: tokens.accessToken });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken ?? (req.body as { refreshToken?: string })?.refreshToken;
    if (!token) throw new HttpError(401, 'no_refresh_token');
    const { user, tokens } = await authService.refresh(token);
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user: authService.toPublicUser(user), accessToken: tokens.accessToken });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/logout', requireAuth, async (req, res, next) => {
  try {
    if (req.user) await authService.logout(req.user.sub);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.sub);
    if (!user) throw new HttpError(404, 'user_not_found');
    res.json({ user: authService.toPublicUser(user as UserDoc) });
  } catch (e) {
    next(e);
  }
});
