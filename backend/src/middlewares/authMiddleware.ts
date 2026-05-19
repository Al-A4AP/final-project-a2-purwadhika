import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return sendError(res, 'Token tidak ditemukan', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
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
