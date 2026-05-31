import type { OrderStatus } from '@prisma/client';
import prisma from '../../config/prisma';
import type { AvailabilityClient, StayRange } from './availabilityTypes';

const ACTIVE_BOOKING_STATUSES: OrderStatus[] = ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'];

export const getAvailabilityClient = (tx?: AvailabilityClient) => tx || prisma;

export const loadRoomOrThrow = async (client: AvailabilityClient, roomId: string) => {
  const room = await client.room.findFirst({ where: { id: roomId, deleted_at: null } });
  if (!room) throw new Error('Kamar tidak ditemukan');
  return room;
};

export const loadBlockedAvailabilities = (client: AvailabilityClient, roomId: string, range: StayRange) => (
  client.roomAvailability.findMany({
    where: { roomId, date: { gte: range.checkIn, lt: range.checkOut }, is_available: false },
  })
);

export const loadOverlappingOrders = (client: AvailabilityClient, roomId: string, range: StayRange) => (
  client.order.findMany({
    where: {
      roomId,
      deleted_at: null,
      status: { in: ACTIVE_BOOKING_STATUSES },
      check_in_date: { lt: range.checkOut },
      check_out_date: { gt: range.checkIn },
    },
  })
);
