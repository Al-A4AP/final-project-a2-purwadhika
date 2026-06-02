import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_RANGE_DAYS = 90;

export const getPublicRoomAvailability = async (
  roomId: string,
  query: { start_date?: unknown; end_date?: unknown },
) => {
  await ensurePublicRoomExists(roomId);
  const range = buildPublicAvailabilityRange(query);
  validateRange(range.start, range.end);
  return findRoomAvailabilities(roomId, range);
};

const ensurePublicRoomExists = async (roomId: string) => {
  const room = await prisma.room.findFirst({
    where: { id: roomId, deleted_at: null, property: { deleted_at: null } },
    select: { id: true },
  });
  if (!room) throw new AppError('Kamar tidak ditemukan', 404);
};

const buildPublicAvailabilityRange = (query: PublicAvailabilityQuery) => ({
  start: parseDateOrDefault(query.start_date, defaultStartDate()),
  end: parseDateOrDefault(query.end_date, defaultEndDate()),
});

const parseDateOrDefault = (value: unknown, fallback: Date) => {
  if (!value) return fallback;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) throw new AppError('Format tanggal tidak valid', 400);
  return startOfUtcDay(parsed);
};

const validateRange = (start: Date, end: Date) => {
  if (end < start) throw new AppError('Tanggal selesai harus setelah tanggal mulai', 400);
  if (getInclusiveDays(start, end) > MAX_RANGE_DAYS) throw new AppError('Rentang ketersediaan maksimal 90 hari', 400);
};

const findRoomAvailabilities = (roomId: string, range: PublicAvailabilityRange) =>
  prisma.roomAvailability.findMany({
    where: { roomId, date: { gte: range.start, lte: range.end } },
    orderBy: { date: 'asc' },
  });

const defaultStartDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

const defaultEndDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
};

const startOfUtcDay = (date: Date) => {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
};

const getInclusiveDays = (start: Date, end: Date) =>
  Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;

interface PublicAvailabilityRange {
  start: Date;
  end: Date;
}

interface PublicAvailabilityQuery {
  start_date?: unknown;
  end_date?: unknown;
}
