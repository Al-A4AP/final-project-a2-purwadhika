import type { RoomAvailability } from "@/services/availabilityService";

const parseDateParts = (value: string) => value.split("-").map((part) => parseInt(part, 10));

export const getUtcStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

export const getDateKey = (date: Date) => getUtcStartOfDay(date).toISOString().split("T")[0];

export const getAvailabilityDate = (availability: RoomAvailability) => {
  const [year, month, day] = parseDateParts(availability.date);
  return new Date(Date.UTC(year, month - 1, day));
};

export const findAvailabilityForDate = (
  availabilities: RoomAvailability[],
  date: Date,
) => availabilities.find((availability) => getAvailabilityDate(availability).getTime() === getUtcStartOfDay(date).getTime());

export const getBlockedDays = (availabilities: RoomAvailability[]) =>
  availabilities.filter((availability) => !availability.is_available).map(getAvailabilityDate);
