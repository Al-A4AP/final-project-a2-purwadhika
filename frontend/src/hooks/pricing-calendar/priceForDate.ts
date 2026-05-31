import type { PeakSeasonRate, Room } from "@/types";
import type { DatePrice } from "./pricingCalendarTypes";

const getDateKey = (date: Date) => date.toISOString().split("T")[0];

const isRoomBlocked = (room: Room, dateKey: string) =>
  room.availabilities?.some((availability) => !availability.is_available && availability.date.startsWith(dateKey)) ?? false;

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

const getRoomDatePrice = (room: Room, date: Date, dateKey: string): DatePrice | null => {
  if (isRoomBlocked(room, dateKey)) return null;
  const rate = getPeakRate(room, date);
  return { price: applyRate(room.base_price, rate), isPeak: !!rate };
};

const getLowestPrice = (prices: DatePrice[]) =>
  prices.reduce((lowest, current) => (current.price < lowest.price ? current : lowest));

export const getLowestPriceForDate = (rooms: Room[], date: Date) => {
  const dateKey = getDateKey(date);
  const prices = rooms.flatMap((room) => getRoomDatePrice(room, date, dateKey) ?? []);
  return prices.length ? getLowestPrice(prices) : null;
};
