import type { Room } from "@/types";
import type { BookingQuery, BookingTotals } from "./bookingTypes";
import { getNightsBetween, toUtcBookingDate } from "./bookingDates";

export const getBookingTotals = (query: BookingQuery, room: Room | null): BookingTotals | null => {
  if (!room || !query.checkIn || !query.checkOut) return null;
  const nights = getNightsBetween(query.checkIn, query.checkOut);
  const totalRoomPrice = room.priceDetails?.totalPrice ?? room.base_price * nights;
  return {
    checkInDate: toUtcBookingDate(query.checkIn),
    checkOutDate: toUtcBookingDate(query.checkOut),
    nights,
    totalRoomPrice,
    totalPrice: totalRoomPrice,
  };
};
