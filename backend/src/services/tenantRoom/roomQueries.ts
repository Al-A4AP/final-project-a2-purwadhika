import type { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';

const roomInclude = {
  images: { orderBy: { order: 'asc' as const } },
  peakRates: { where: { deleted_at: null } },
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
