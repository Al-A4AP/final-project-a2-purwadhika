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

export const getCustomerBookedDays = (availabilities: RoomAvailability[]) =>
  availabilities.filter(isCustomerBooked).map(getAvailabilityDate);

export const getTenantBlockedDays = (availabilities: RoomAvailability[]) => {
  const bookedKeys = new Set(getCustomerBookedDays(availabilities).map(getDateKey));
  return availabilities.filter((availability) => isTenantBlocked(availability, bookedKeys)).map(getAvailabilityDate);
};

const isCustomerBooked = (availability: RoomAvailability) =>
  availability.source === "CUSTOMER_BOOKED";

const isTenantBlocked = (availability: RoomAvailability, bookedKeys: Set<string>) =>
  !availability.is_available && !isCustomerBooked(availability) && !bookedKeys.has(getDateKey(getAvailabilityDate(availability)));
