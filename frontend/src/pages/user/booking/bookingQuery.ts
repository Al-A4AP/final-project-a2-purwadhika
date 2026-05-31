import type { URLSearchParamsInit } from "react-router-dom";
import type { BookingQuery } from "./bookingTypes";

type SearchParamsLike = URLSearchParamsInit & {
  get: (name: string) => string | null;
};

export const getBookingQuery = (searchParams: SearchParamsLike): BookingQuery => ({
  propertyId: searchParams.get("propertyId"),
  roomId: searchParams.get("roomId"),
  checkIn: searchParams.get("checkIn"),
  checkOut: searchParams.get("checkOut"),
});

export const isBookingQueryComplete = (query: BookingQuery) =>
  Boolean(query.propertyId && query.roomId && query.checkIn && query.checkOut);
