import { Request } from 'express';
import { Property, Room, PeakSeasonRate } from '@prisma/client';
import type { AuthRole } from './authJwt';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      property?: Property;
      room?: Room;
      peakRate?: PeakSeasonRate;
    }
  }
}

export {};
