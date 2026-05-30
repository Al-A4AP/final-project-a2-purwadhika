import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_RANGE_DAYS = 90;

const startOfUtcDay = (date: Date) => {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
};

const defaultStartDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

const defaultEndDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
};

const parseDateOrDefault = (value: unknown, fallback: Date) => {
  if (!value) return fallback;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) throw new AppError('Format tanggal tidak valid', 400);
  return startOfUtcDay(parsed);
};

const validateRange = (start: Date, end: Date) => {
  if (end < start) throw new AppError('Tanggal selesai harus setelah tanggal mulai', 400);
  const days = Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
  if (days > MAX_RANGE_DAYS) throw new AppError('Rentang ketersediaan maksimal 90 hari', 400);
};

export const getPublicRoomAvailability = async (
  roomId: string,
  query: { start_date?: unknown; end_date?: unknown },
) => {
  const room = await prisma.room.findFirst({
    where: { id: roomId, deleted_at: null, property: { deleted_at: null } },
    select: { id: true },
  });
  if (!room) throw new AppError('Kamar tidak ditemukan', 404);

  const start = parseDateOrDefault(query.start_date, defaultStartDate());
  const end = parseDateOrDefault(query.end_date, defaultEndDate());
  validateRange(start, end);

  return prisma.roomAvailability.findMany({
    where: { roomId, date: { gte: start, lte: end } },
    orderBy: { date: 'asc' },
  });
};
