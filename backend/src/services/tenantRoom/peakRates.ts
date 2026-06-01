import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { buildPeakRateData } from './roomData';
import type { PeakRateFormData } from './tenantRoomTypes';

export const findRoomPeakRates = (roomId: string) => prisma.peakSeasonRate.findMany({
  where: { roomId, deleted_at: null },
  orderBy: { start_date: 'asc' },
});

export const createRoomPeakRate = async (roomId: string, data: PeakRateFormData) => {
  const peakRate = buildPeakRateData(roomId, data);
  validatePeakRateDates(peakRate.start_date, peakRate.end_date);
  await ensureNoPeakRateOverlap(roomId, peakRate.start_date, peakRate.end_date);
  return prisma.peakSeasonRate.create({ data: peakRate });
};

export const updateRoomPeakRate = async (id: string, roomId: string, data: PeakRateFormData) => {
  const peakRate = buildPeakRateData(roomId, data);
  validatePeakRateDates(peakRate.start_date, peakRate.end_date);
  await ensureNoPeakRateOverlap(roomId, peakRate.start_date, peakRate.end_date, id);
  return prisma.peakSeasonRate.update({ where: { id }, data: peakRate });
};

export const softDeletePeakRate = (id: string) =>
  prisma.peakSeasonRate.update({ where: { id }, data: { deleted_at: new Date() } });

const validatePeakRateDates = (start: Date, end: Date) => {
  if (start >= end) throw new AppError('Tanggal selesai harus setelah tanggal mulai', 400);
};
const ensureNoPeakRateOverlap = async (roomId: string, start: Date, end: Date, excludeId?: string) => {
  const existing = await findOverlappingPeakRate(roomId, start, end, excludeId);
  if (existing) throw new AppError('Terdapat jadwal Peak Season yang bentrok pada rentang tanggal tersebut', 400);
};
const findOverlappingPeakRate = (roomId: string, start: Date, end: Date, excludeId?: string) => prisma.peakSeasonRate.findFirst({
  where: { id: excludeId ? { not: excludeId } : undefined, roomId, deleted_at: null, start_date: { lte: end }, end_date: { gte: start } },
});
