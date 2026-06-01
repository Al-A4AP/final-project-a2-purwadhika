import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';

export const ensureTenantProperty = async (propertyId: string, tenantId: string) => {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, tenantId, deleted_at: null },
    include: { category: true },
  });
  if (!property) throw new AppError('Properti tidak ditemukan', 404);
  return property;
};

export const verifyRoomOwner = async (roomId: string, tenantId: string) => {
  const room = await prisma.room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { property: { include: { category: true } } },
  });
  if (!room || room.property.tenantId !== tenantId) throw new AppError('Kamar tidak ditemukan', 404);
  return room;
};

export const verifyPeakRateOwner = async (rateId: string, tenantId: string) => {
  const rate = await prisma.peakSeasonRate.findFirst({
    where: { id: rateId, deleted_at: null },
    include: { room: { include: { property: true } } },
  });
  if (!rate || rate.room.property.tenantId !== tenantId) throw new AppError('Rate tidak ditemukan', 404);
  return rate;
};
