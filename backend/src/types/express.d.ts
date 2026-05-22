import { Request } from 'express';
import { Property, Room, PeakSeasonRate } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'USER' | 'TENANT';
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
