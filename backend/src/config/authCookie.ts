import type { CookieOptions } from 'express';
import { env } from './env';

export const AUTH_COOKIE_NAME = 'auth_token';
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: AUTH_COOKIE_MAX_AGE,
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
  secure: env.NODE_ENV === 'production',
};

export const clearAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
  secure: env.NODE_ENV === 'production',
};
