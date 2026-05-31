import { useCallback, useMemo } from "react";
import type { Room } from "@/types";
import { getNights, getToday } from "./pricing-calendar/dateUtils";
import { getLowestPriceForDate } from "./pricing-calendar/priceForDate";
import type { PricingDateRange } from "./pricing-calendar/pricingCalendarTypes";
import { syncSelectedDate } from "./pricing-calendar/selectDate";

export const usePricingCalendar = (
  rooms: Room[],
  checkIn: string,
  checkOut: string,
  onCheckInChange: (val: string) => void,
  onCheckOutChange: (val: string) => void,
) => {
  const today = useMemo(() => getToday(), []);
  const selectedRange = useSelectedRange(checkIn, checkOut);
  const handleSelect = useSelectHandler(onCheckInChange, onCheckOutChange);
  const getPriceForDate = useCallback((date: Date) => getLowestPriceForDate(rooms, date), [rooms]);
  return { today, getPriceForDate, selectedRange, handleSelect, nights: getNights(checkIn, checkOut) };
};

const useSelectedRange = (checkIn: string, checkOut: string) =>
  useMemo(() => ({
    from: checkIn ? new Date(checkIn) : undefined,
    to: checkOut ? new Date(checkOut) : undefined,
  }), [checkIn, checkOut]);

const useSelectHandler = (
  onCheckInChange: (val: string) => void,
  onCheckOutChange: (val: string) => void,
) => useCallback((range: PricingDateRange) => {
  syncSelectedDate(range?.from, onCheckInChange);
  syncSelectedDate(range?.to, onCheckOutChange);
}, [onCheckInChange, onCheckOutChange]);
