import type { Order, Prisma, PrismaClient, Room, RoomAvailability } from '@prisma/client';

export type AvailabilityClient = Prisma.TransactionClient | PrismaClient;
export type ActiveOrder = Pick<Order, 'check_in_date' | 'check_out_date'>;
export type AvailableRoom = Pick<Room, 'id' | 'quantity'>;
export type BlockedAvailability = Pick<RoomAvailability, 'date'>;

export interface StayRange {
  checkIn: Date;
  checkOut: Date;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
}
