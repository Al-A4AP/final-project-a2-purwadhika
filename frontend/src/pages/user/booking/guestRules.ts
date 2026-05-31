import type { BookingGuests, GuestType } from "./bookingTypes";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const updateAdults = (guests: BookingGuests, capacity: number, delta: number) => {
  const adults = clamp(guests.adults + delta, 1, capacity);
  return { adults, children: Math.min(adults, guests.children), babies: Math.min(adults, guests.babies) };
};

export const getNextGuests = (
  guests: BookingGuests,
  capacity: number,
  type: GuestType,
  delta: number,
) => {
  if (type === "adults") return updateAdults(guests, capacity, delta);
  if (type === "children") return { ...guests, children: clamp(guests.children + delta, 0, guests.adults) };
  return { ...guests, babies: clamp(guests.babies + delta, 0, guests.adults) };
};
