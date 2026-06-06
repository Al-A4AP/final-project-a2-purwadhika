import type { SetURLSearchParams } from "react-router-dom";
import type { BookingQuery } from "@/hooks/user/booking/bookingTypes";
import { addDaysInput, getCheckoutMinDate, getTodayInput, isCheckoutAfterCheckIn } from "./bookingDateUtils";

export const useBookingDateParams = (query: BookingQuery, setSearchParams: SetURLSearchParams) => ({
  checkIn: query.checkIn || "",
  checkOut: query.checkOut || "",
  checkoutMinDate: getCheckoutMinDate(query.checkIn),
  today: getTodayInput(),
  setCheckIn: (value: string) => value && updateCheckIn(query, setSearchParams, value),
  setCheckOut: (value: string) => value && updateQueryDates(query, setSearchParams, { checkOut: value }),
});

const updateCheckIn = (query: BookingQuery, setSearchParams: SetURLSearchParams, checkIn: string) => {
  const checkOut = getSafeCheckout(checkIn, query.checkOut);
  updateQueryDates(query, setSearchParams, { checkIn, checkOut });
};

const getSafeCheckout = (checkIn: string, checkOut: string | null) =>
  checkOut && isCheckoutAfterCheckIn(checkIn, checkOut) ? checkOut : addDaysInput(checkIn, 1);

const updateQueryDates = (query: BookingQuery, setSearchParams: SetURLSearchParams, dates: Partial<BookingQuery>) =>
  setSearchParams(buildBookingSearchParams({ ...query, ...dates }));

const buildBookingSearchParams = (query: BookingQuery) => {
  const params = new URLSearchParams();
  appendParam(params, "propertyId", query.propertyId);
  appendParam(params, "roomId", query.roomId);
  appendParam(params, "checkIn", query.checkIn);
  appendParam(params, "checkOut", query.checkOut);
  return params;
};

const appendParam = (params: URLSearchParams, key: string, value: string | null) => {
  if (value) params.set(key, value);
};
