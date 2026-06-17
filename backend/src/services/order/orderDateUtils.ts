import { AppError } from '../../middlewares/errorHandler';

export const parseStayDates = (checkIn: string, checkOut: string) => ({
  checkIn: new Date(checkIn),
  checkOut: new Date(checkOut),
});

export const validateDates = (checkIn: Date, checkOut: Date) => {
  if (checkIn >= checkOut) {
    throw new AppError("Tanggal check-out harus lebih dari check-in", 400);
  }
  if (startOfUtcDay(checkIn) < todayUtc()) {
    throw new AppError("Tanggal check-in tidak boleh di masa lalu", 400);
  }
};

export const startOfUtcDay = (date: Date) => {
  const value = new Date(date);
  value.setUTCHours(0, 0, 0, 0);
  return value;
};

export const todayUtc = () => startOfUtcDay(new Date());
