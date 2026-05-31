export const normalizeUtcDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
};

export const buildStayRange = (checkIn: Date, checkOut: Date) => {
  const ci = normalizeUtcDay(checkIn);
  const co = normalizeUtcDay(checkOut);
  if (ci >= co) throw new Error('Tanggal check-out harus setelah check-in');
  return { ci, co };
};

export const countNights = (ci: Date, co: Date) =>
  Math.ceil((co.getTime() - ci.getTime()) / 86400000);
