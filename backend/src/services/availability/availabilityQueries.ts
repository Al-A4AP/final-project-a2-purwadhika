import type { OrderStatus } from '@prisma/client';
import prisma from '../../config/prisma';
import type { AvailabilityClient, RoomAvailabilityContext, StayRange } from './availabilityTypes';

const ACTIVE_BOOKING_STATUSES: OrderStatus[] = ['WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'];

export const getAvailabilityClient = (tx?: AvailabilityClient) => tx || prisma;

export const loadRoomOrThrow = async (client: AvailabilityClient, roomId: string) => {
  const room = await client.room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { property: { select: { id: true, rental_type: true } } },
  });
  if (!room) throw new Error('Kamar tidak ditemukan');
  return room;
};

export type RoomWithPropertyContext = NonNullable<Awaited<ReturnType<typeof loadRoomOrThrow>>>;

export const loadBlockedAvailabilities = (client: AvailabilityClient, room: RoomAvailabilityContext, range: StayRange) => {
  const scope = room.property.rental_type === 'WHOLE_PROPERTY'
    ? { room: { propertyId: room.property.id } }
    : { roomId: room.id };
  return client.roomAvailability.findMany({
    where: { ...scope, date: { gte: range.checkIn, lt: range.checkOut }, is_available: false },
  });
};

export const loadOverlappingOrders = (client: AvailabilityClient, room: RoomAvailabilityContext, range: StayRange) => {
  const scope = room.property.rental_type === 'WHOLE_PROPERTY'
    ? { propertyId: room.property.id }
    : { roomId: room.id };
  return client.order.findMany({
    where: {
      ...scope,
      deleted_at: null,
      ...activeOrderStatusWhere(),
      check_in_date: { lt: range.checkOut },
      check_out_date: { gt: range.checkIn },
    },
  });
};

const activeOrderStatusWhere = () => ({
  OR: [
    { status: { in: ACTIVE_BOOKING_STATUSES } },
    { status: 'WAITING_PAYMENT' as OrderStatus, OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }] },
  ],
});
