import type { User } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { sendFailedLoginWarningEmail } from '../utils/emailService';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const LOCKED_MESSAGE = 'Terlalu banyak percobaan login. Silakan coba lagi beberapa menit lagi.';
const INVALID_LOGIN_MESSAGE = 'Email atau password salah';

type LoginAttempt = {
  count: number;
  lockedUntil?: Date;
};

const attempts = new Map<string, LoginAttempt>();

export const normalizeLoginEmail = (email: string) =>
  email.trim().toLowerCase();

export const assertLoginNotLocked = (email: string) => {
  const attempt = attempts.get(email);
  if (!attempt?.lockedUntil) return;
  if (attempt.lockedUntil <= new Date()) return attempts.delete(email);
  throw new AppError(LOCKED_MESSAGE, 429);
};

export const rejectFailedLogin = async (
  email: string,
  user?: Pick<User, 'email'> | null,
): Promise<never> => {
  const attempt = getNextAttempt(email);
  if (attempt.count >= MAX_FAILED_ATTEMPTS) {
    attempt.lockedUntil = getLockExpiry();
    await notifyFailedLoginThreshold(user);
    throw new AppError(LOCKED_MESSAGE, 429);
  }
  throw new AppError(INVALID_LOGIN_MESSAGE, 401);
};

export const resetFailedLogin = (email: string) => {
  attempts.delete(email);
};

const getNextAttempt = (email: string) => {
  const current = attempts.get(email) || { count: 0 };
  const next = { count: current.count + 1, lockedUntil: current.lockedUntil };
  attempts.set(email, next);
  return next;
};

const getLockExpiry = () =>
  new Date(Date.now() + LOCK_DURATION_MS);

const notifyFailedLoginThreshold = async (user?: Pick<User, 'email'> | null) => {
  if (!user) return;
  await sendFailedLoginWarningEmail(user.email).catch(() => undefined);
};
