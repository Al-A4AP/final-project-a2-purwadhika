import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  setBaseSecurityHeaders(res);
  if (env.NODE_ENV === 'production') setProductionSecurityHeaders(res);
  next();
};

const setBaseSecurityHeaders = (res: Response) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
};

const setProductionSecurityHeaders = (res: Response) =>
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
