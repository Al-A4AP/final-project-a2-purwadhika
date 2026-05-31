import prisma from '../../config/prisma';
import type { PricingClient } from './pricingTypes';

export const getPricingClient = (tx?: PricingClient) => tx || prisma;

export const findRoomWithPeakRates = (roomId: string, tx?: PricingClient) =>
  getPricingClient(tx).room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { peakRates: { where: { deleted_at: null } } },
  });
