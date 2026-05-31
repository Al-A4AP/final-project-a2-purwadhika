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
  const handleBooking = (room: Room) => {
    clearDateError();
    const result = validateBookingDates(checkIn, checkOut);
    if (result.focusDate) focusDatePicker();
    if (result.message) return setDateError(result.message);
    if (!result.ciUTC || !result.coUTC) return focusDatePicker();
    filters.setCheckInDate(checkIn);
    filters.setCheckOutDate(checkOut);
    navigate(`/booking?propertyId=${id}&roomId=${room.id}&checkIn=${result.ciUTC}&checkOut=${result.coUTC}`);
  };
  return { clearDateError, dateError, handleBooking };
};
