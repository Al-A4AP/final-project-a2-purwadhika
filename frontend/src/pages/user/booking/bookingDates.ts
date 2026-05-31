export const toUtcBookingDate = (date: string) => new Date(`${date}T00:00:00Z`);

export const toUtcDateTime = (date: string) => `${date}T00:00:00Z`;

export const getTodayUtc = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const getNightsBetween = (checkIn: string, checkOut: string) =>
  Math.ceil((toUtcBookingDate(checkOut).getTime() - toUtcBookingDate(checkIn).getTime()) / 86400000);
