import type { RoomAvailability } from "@/services/availabilityService";

const parseDateParts = (value: string) => value.split("-").map((part) => parseInt(part, 10));

export const getDateKey = (date: Date) =>
  [date.getFullYear(), padDatePart(date.getMonth() + 1), padDatePart(date.getDate())].join("-");

const padDatePart = (value: number) => String(value).padStart(2, "0");

export const getAvailabilityDate = (availability: RoomAvailability) => {
  const [year, month, day] = parseDateParts(availability.date);
  return new Date(year, month - 1, day);
};

export const findAvailabilityForDate = (
  availabilities: RoomAvailability[],
  date: Date,
) => availabilities.find((availability) => getDateKey(getAvailabilityDate(availability)) === getDateKey(date));

export const getBlockedDays = (availabilities: RoomAvailability[]) =>
  availabilities.filter((availability) => !availability.is_available).map(getAvailabilityDate);
