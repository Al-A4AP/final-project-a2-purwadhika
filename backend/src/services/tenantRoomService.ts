import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';

const verifyRoomOwner = async (roomId: string, tenantId: string) => {
  const room = await prisma.room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { property: true },
  });
  if (!room || room.property.tenantId !== tenantId) throw new AppError('Kamar tidak ditemukan', 404);
  return room;
};

export const getRooms = async (propertyId: string, tenantId: string) => {
  const p = await prisma.property.findFirst({ where: { id: propertyId, tenantId, deleted_at: null } });
  if (!p) throw new AppError('Properti tidak ditemukan', 404);
  return prisma.room.findMany({
    where: { propertyId, deleted_at: null },
    include: { peakRates: { where: { deleted_at: null } } },
    orderBy: { created_at: 'asc' },
  });
};

export const createRoom = async (propertyId: string, tenantId: string, data: any) => {
  const p = await prisma.property.findFirst({ where: { id: propertyId, tenantId, deleted_at: null } });
  if (!p) throw new AppError('Properti tidak ditemukan', 404);
  return prisma.room.create({
    data: {
      propertyId, room_type: data.room_type,
      base_price: Number(data.base_price), capacity: Number(data.capacity),
      description: data.description || null,
    },
  });
};

export const updateRoom = async (roomId: string, tenantId: string, data: any) => {
  const room = await verifyRoomOwner(roomId, tenantId);
  return prisma.room.update({
    where: { id: roomId },
    data: {
      room_type: data.room_type ?? room.room_type,
      base_price: data.base_price ? Number(data.base_price) : room.base_price,
      capacity: data.capacity ? Number(data.capacity) : room.capacity,
      description: data.description ?? room.description,
    },
  });
};

export const deleteRoom = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  return prisma.room.update({ where: { id: roomId }, data: { deleted_at: new Date() } });
};

export const getPeakRates = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  return prisma.peakSeasonRate.findMany({
    where: { roomId, deleted_at: null },
    orderBy: { start_date: 'asc' },
  });
};

export const createPeakRate = async (roomId: string, tenantId: string, data: any) => {
  await verifyRoomOwner(roomId, tenantId);
  return prisma.peakSeasonRate.create({
    data: {
      roomId, rate_type: data.rate_type,
      start_date: new Date(data.start_date), end_date: new Date(data.end_date),
      rate_value: Number(data.rate_value), description: data.description || null,
    },
  });
};

export const deletePeakRate = async (id: string, tenantId: string) => {
  const rate = await prisma.peakSeasonRate.findFirst({
    where: { id, deleted_at: null },
    include: { room: { include: { property: true } } },
  });
  if (!rate || rate.room.property.tenantId !== tenantId) throw new AppError('Rate tidak ditemukan', 404);
  return prisma.peakSeasonRate.update({ where: { id }, data: { deleted_at: new Date() } });
};
