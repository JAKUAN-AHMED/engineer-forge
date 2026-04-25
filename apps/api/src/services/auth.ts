import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../env';
import { User, type UserDoc } from '../db/models/user';
import { HttpError } from '../middleware/errorHandler';
import type { AuthPayload } from '../middleware/auth';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function sign(payload: AuthPayload, secret: string, ttl: string): string {
  return jwt.sign(payload, secret, { expiresIn: ttl } as SignOptions);
}

export function issueTokens(user: UserDoc): AuthTokens {
  const payload: AuthPayload = { sub: user._id.toString(), role: user.role as AuthPayload['role'] };
  return {
    accessToken: sign(payload, env.JWT_ACCESS_SECRET, env.ACCESS_TOKEN_TTL),
    refreshToken: sign(payload, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_TTL),
  };
}

export async function signup(input: { email: string; password: string; name: string }): Promise<{ user: UserDoc; tokens: AuthTokens }> {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new HttpError(409, 'email_taken');
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    email: input.email,
    passwordHash,
    name: input.name,
  });
  const tokens = issueTokens(user as UserDoc);
  user.set('refreshTokenHash', await bcrypt.hash(tokens.refreshToken, 10));
  await user.save();
  return { user: user as UserDoc, tokens };
}

export async function login(input: { email: string; password: string }): Promise<{ user: UserDoc; tokens: AuthTokens }> {
  const user = await User.findOne({ email: input.email });
  if (!user) throw new HttpError(401, 'invalid_credentials');
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'invalid_credentials');
  const tokens = issueTokens(user as UserDoc);
  user.set('refreshTokenHash', await bcrypt.hash(tokens.refreshToken, 10));
  await user.save();
  return { user: user as UserDoc, tokens };
}

export async function refresh(refreshToken: string): Promise<{ user: UserDoc; tokens: AuthTokens }> {
  let payload: AuthPayload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as AuthPayload;
  } catch {
    throw new HttpError(401, 'invalid_refresh');
  }
  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokenHash) throw new HttpError(401, 'invalid_refresh');
  const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!ok) throw new HttpError(401, 'invalid_refresh');
  const tokens = issueTokens(user as UserDoc);
  user.set('refreshTokenHash', await bcrypt.hash(tokens.refreshToken, 10));
  await user.save();
  return { user: user as UserDoc, tokens };
}

export async function logout(userId: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $set: { refreshTokenHash: null } });
}

export function toPublicUser(user: UserDoc) {
  const streak = user.streak ?? { current: 0, longest: 0 };
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    xp: user.xp,
    level: user.level,
    streak: { current: streak.current ?? 0, longest: streak.longest ?? 0 },
    badges: user.badges,
  };
}
