import type { StayRange } from './availabilityTypes';

export const normalizeDate = (date: Date) => {
  const value = new Date(date);
  value.setUTCHours(0, 0, 0, 0);
  return value;
};

export const normalizeStayRange = (checkInDate: Date, checkOutDate: Date): StayRange => {
  const checkIn = normalizeDate(checkInDate);
  const checkOut = normalizeDate(checkOutDate);
  if (checkIn >= checkOut) throw new Error('Tanggal check-out harus setelah tanggal check-in');
  return { checkIn, checkOut };
};

export const buildNights = ({ checkIn, checkOut }: StayRange) => {
  const nights: Date[] = [];
  const current = new Date(checkIn);
  while (current < checkOut) {
    nights.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return nights;
};

export const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
