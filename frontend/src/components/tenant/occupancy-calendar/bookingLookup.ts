import type { OccupancyRoom } from "@/services/tenantReportService";

const noonDate = (date: Date | string) => {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  return value;
};

const isDateInRange = (checkDate: Date, startStr: string, endStr: string, isExclusiveEnd: boolean = false) => {
  const start = noonDate(startStr);
  const end = noonDate(endStr);
  return checkDate >= start && (isExclusiveEnd ? checkDate < end : checkDate <= end);
};

export const getDayBooking = (room: OccupancyRoom, day: number, year: number, month: number) => {
  const checkDate = noonDate(new Date(year, month, day));
  return room.orders.find((order) => isDateInRange(checkDate, order.check_in_date, order.check_out_date, true));
};

export const getDayBlocked = (room: OccupancyRoom, day: number, year: number, month: number) => {
  const checkDate = noonDate(new Date(year, month, day));
  return room.blockedRanges.find((range) => isDateInRange(checkDate, range.start_date, range.end_date));
};

export const getDayPeakRate = (room: OccupancyRoom, day: number, year: number, month: number) => {
  const checkDate = noonDate(new Date(year, month, day));
  return room.peakRateRanges.find((range) => isDateInRange(checkDate, range.start_date, range.end_date));
};
