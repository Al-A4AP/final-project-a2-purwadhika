import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME } from '../config/authCookie';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { isTokenBlacklisted } from '../services/tokenBlacklistService';
import { isAuthJwtPayload } from '../types/authJwt';

const getRequestToken = (req: Request) =>
  req.headers.authorization?.split(' ')[1] || req.cookies?.[AUTH_COOKIE_NAME];

const verifyRequestToken = (token: string) => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return isAuthJwtPayload(decoded) ? decoded : null;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = getRequestToken(req);
  if (!token) return sendError(res, 'Token tidak ditemukan', 401);
  if (isTokenBlacklisted(token)) return sendError(res, 'Token sudah di-revoke', 401);
  try {
    const decoded = verifyRequestToken(token);
    if (!decoded) return sendError(res, 'Token tidak valid atau kadaluarsa', 401);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    return sendError(res, 'Token tidak valid atau kadaluarsa', 401);
  }
};

export const requireRole = (roles: ('USER' | 'TENANT')[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Akses ditolak', 403);
    }
    next();
  };
