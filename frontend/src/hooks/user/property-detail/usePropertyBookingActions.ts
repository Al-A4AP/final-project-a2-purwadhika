import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { Room } from "@/types";
import { focusDatePicker, validateBookingDates } from "./propertyDetailDates";

interface BookingFilters {
  setCheckInDate: (date: string) => void;
  setCheckOutDate: (date: string) => void;
}

interface BookingActionOptions {
  checkIn: string;
  checkOut: string;
  filters: BookingFilters;
  id?: string;
  navigate: NavigateFunction;
}

export const usePropertyBookingActions = ({ checkIn, checkOut, filters, id, navigate }: BookingActionOptions) => {
  const [dateError, setDateError] = useState("");
  const clearDateError = () => setDateError("");
  const bookRoom = createBookRoomHandler({ clearDateError, filters, id, navigate, setDateError });
  const handleBooking = (room: Room) => bookRoom(room, checkIn, checkOut);
  return { clearDateError, dateError, handleBooking, bookRoom };
};

const createBookRoomHandler = (options: BookingHandlerOptions) => (room: Room, checkIn: string, checkOut: string) => {
  options.clearDateError();
  const result = validateBookingDates(checkIn, checkOut);
  if (shouldStopBooking(result, options.setDateError)) return;
  if (!result.ciUTC || !result.coUTC) return focusDatePicker();
  options.filters.setCheckInDate(checkIn);
  options.filters.setCheckOutDate(checkOut);
  openBookingPage(room, result, options);
};

const shouldStopBooking = (result: BookingDateResult, setDateError: (message: string) => void) => {
  if (result.focusDate) focusDatePicker();
  if (!result.message) return false;
  setDateError(result.message);
  return true;
};

const openBookingPage = (room: Room, result: BookingDateResult, options: BookingHandlerOptions) =>
  options.navigate(`/booking?propertyId=${options.id}&roomId=${room.id}&checkIn=${result.ciUTC}&checkOut=${result.coUTC}`);

interface BookingHandlerOptions extends Pick<BookingActionOptions, "filters" | "id" | "navigate"> {
  clearDateError: () => void;
  setDateError: (message: string) => void;
}

type BookingDateResult = ReturnType<typeof validateBookingDates>;
