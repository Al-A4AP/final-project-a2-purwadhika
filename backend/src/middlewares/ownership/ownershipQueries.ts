import prisma from '../../config/prisma';

export const findOwnedProperty = (propertyId: string, tenantId: string) => prisma.property.findFirst({
  where: { id: propertyId, tenantId, deleted_at: null },
});

export const findOwnedRoom = (roomId: string, tenantId: string) => prisma.room.findFirst({
  where: { id: roomId, deleted_at: null, property: { tenantId, deleted_at: null } },
});

export const findOwnedPeakRate = (rateId: string, tenantId: string) => prisma.peakSeasonRate.findFirst({
  where: {
    id: rateId,
    deleted_at: null,
    room: { deleted_at: null, property: { tenantId, deleted_at: null } },
  },
});
