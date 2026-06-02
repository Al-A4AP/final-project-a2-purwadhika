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
  const bookRoom = (room: Room, nextCheckIn: string, nextCheckOut: string) => {
    clearDateError();
    const result = validateBookingDates(nextCheckIn, nextCheckOut);
    if (result.focusDate) focusDatePicker();
    if (result.message) return setDateError(result.message);
    if (!result.ciUTC || !result.coUTC) return focusDatePicker();
    filters.setCheckInDate(nextCheckIn);
    filters.setCheckOutDate(nextCheckOut);
    navigate(`/booking?propertyId=${id}&roomId=${room.id}&checkIn=${result.ciUTC}&checkOut=${result.coUTC}`);
  };
  const handleBooking = (room: Room) => bookRoom(room, checkIn, checkOut);
  return { clearDateError, dateError, handleBooking, bookRoom };
};
