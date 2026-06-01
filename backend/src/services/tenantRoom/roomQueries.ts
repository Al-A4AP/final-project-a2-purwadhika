import type { OrderStatus, Prisma } from '@prisma/client';
import prisma from '../../config/prisma';

const BOOKED_ROOM_STATUSES: OrderStatus[] = ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'];

const roomInclude = {
  images: { orderBy: { order: 'asc' as const } },
  peakRates: { where: { deleted_at: null } },
};

const todayUtc = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const findRoomsByProperty = (propertyId: string) => prisma.room.findMany({
  where: { propertyId, deleted_at: null },
  include: roomInclude,
  orderBy: { created_at: 'asc' },
});
export const createRoomRecord = (data: Prisma.RoomUncheckedCreateInput) =>
  prisma.room.create({ data, include: roomInclude });
export const updateRoomRecord = (roomId: string, data: Prisma.RoomUncheckedUpdateInput) =>
  prisma.room.update({ where: { id: roomId }, data, include: roomInclude });
export const findRoomById = (roomId: string) =>
  prisma.room.findUnique({ where: { id: roomId }, include: roomInclude });
export const softDeleteRoomRecord = (roomId: string) =>
  prisma.room.update({ where: { id: roomId }, data: { deleted_at: new Date() } });
export const findRoomAvailabilities = (roomId: string) =>
  prisma.roomAvailability.findMany({ where: { roomId }, orderBy: { date: 'asc' } });
export const findRoomBookedOrders = (roomId: string) =>
  prisma.order.findMany({
    where: { roomId, deleted_at: null, status: { in: BOOKED_ROOM_STATUSES }, check_out_date: { gte: todayUtc() } },
    select: { check_in_date: true, check_out_date: true, id: true, roomId: true },
    orderBy: { check_in_date: 'asc' },
  });
export const upsertRoomAvailability = (roomId: string, date: Date, isAvailable: boolean) =>
  prisma.roomAvailability.upsert({
    where: { roomId_date: { roomId, date } },
    update: { is_available: isAvailable },
    create: { roomId, date, is_available: isAvailable },
  });
export const upsertRoomAvailabilityRange = (roomId: string, dates: Date[], isAvailable: boolean) =>
  prisma.$transaction(dates.map((date) => prisma.roomAvailability.upsert({
    where: { roomId_date: { roomId, date } },
    update: { is_available: isAvailable },
    create: { roomId, date, is_available: isAvailable },
  })));
