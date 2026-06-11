import type { PeakSeasonRate, Room } from "@/types";
import type { DateAvailabilityStatus, DatePrice } from "./pricingCalendarTypes";

const pad = (value: number) => String(value).padStart(2, "0");

export const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getAvailabilityRecords = (room: Room) => room.availabilities || room.availability || [];

export const getDateStatus = (room: Room, dateKey: string): DateAvailabilityStatus | null => {
  const record = getAvailabilityRecords(room).find((item) => !item.is_available && item.date.startsWith(dateKey));
  if (!record) return null;
  if (record.source === "CUSTOMER_BOOKED") return "CUSTOMER_BOOKED";
  if (record.source === "TENANT_BLOCKED") return "TENANT_BLOCKED";
  return "UNAVAILABLE";
};

const normalizeDate = (value: Date | string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isDateInRate = (date: Date, rate: PeakSeasonRate) =>
  date >= normalizeDate(rate.start_date) && date <= normalizeDate(rate.end_date);

const getPeakRate = (room: Room, date: Date) =>
  room.peakRates?.find((rate) => isDateInRate(date, rate));

const applyRate = (basePrice: number, rate?: PeakSeasonRate) => {
  if (!rate) return basePrice;
  if (rate.rate_type === "PERCENTAGE") return basePrice + Math.round((basePrice * rate.rate_value) / 100);
  return basePrice + rate.rate_value;
};

export const getRoomPriceForDate = (room: Room | null, date: Date): DatePrice | null => {
  if (!room) return null;
  const dateKey = getDateKey(date);
  const status = getDateStatus(room, dateKey);
  if (status) return { price: null, isPeak: false, status };
  const rate = getPeakRate(room, date);
  return { price: applyRate(room.base_price, rate), isPeak: !!rate, status: "AVAILABLE" };
};

export const getUnavailableDates = (room: Room | null) =>
  room ? getAvailabilityRecords(room).filter((item) => !item.is_available).map((item) => new Date(item.date)) : [];
