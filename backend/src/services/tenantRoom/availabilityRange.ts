import { AppError } from '../../middlewares/errorHandler';
import { normalizeAvailabilityDate } from './roomData';

const MS_PER_DAY = 86_400_000;
const MAX_RANGE_DAYS = 365;

export const buildAvailabilityRangeDates = (start: Date, end: Date) => {
  const range = normalizeAvailabilityRange(start, end);
  validateRangeSize(range.start, range.end);
  return buildDateList(range.start, range.end);
};

const normalizeAvailabilityRange = (start: Date, end: Date) => ({
  start: normalizeAvailabilityDate(start),
  end: normalizeAvailabilityDate(end),
});

const validateRangeSize = (start: Date, end: Date) => {
  const days = getInclusiveDays(start, end);
  if (days < 1) throw new AppError('Tanggal selesai tidak boleh sebelum tanggal mulai', 400);
  if (days > MAX_RANGE_DAYS) throw new AppError('Rentang ketersediaan maksimal 365 hari', 400);
};

const buildDateList = (start: Date, end: Date) => {
  const dates: Date[] = [];
  for (let time = start.getTime(); time <= end.getTime(); time += MS_PER_DAY) dates.push(new Date(time));
  return dates;
};

const getInclusiveDays = (start: Date, end: Date) =>
  Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
