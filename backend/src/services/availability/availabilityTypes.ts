import type { Order, Prisma, PrismaClient, RentalType, Room, RoomAvailability } from '@prisma/client';

export type AvailabilityClient = Prisma.TransactionClient | PrismaClient;
export type ActiveOrder = Pick<Order, 'check_in_date' | 'check_out_date'>;
export type AvailableRoom = Pick<Room, 'id' | 'quantity'>;
export type BlockedAvailability = Pick<RoomAvailability, 'date'>;

export interface StayRange {
  checkIn: Date;
  checkOut: Date;
}

export interface RoomAvailabilityContext {
  id: string;
  property: {
    id: string;
    rental_type: RentalType;
  };
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  source?: 'TENANT_BLOCKED' | 'CUSTOMER_BOOKED';
}
