import type { PeakSeasonRate, Prisma, PrismaClient, Room } from '@prisma/client';

export interface StayDetailBreakdown {
  date: string;
  price: number;
  isPeak: boolean;
  rateName?: string;
}

export type PricingClient = Prisma.TransactionClient | PrismaClient;
export type PeakRate = PeakSeasonRate;
export type RoomWithPeakRates = Room & { peakRates: PeakSeasonRate[] };
