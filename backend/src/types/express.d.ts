import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'USER' | 'TENANT';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
