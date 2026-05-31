import { normalizeDate } from './availabilityDates';
import type { ActiveOrder, BlockedAvailability } from './availabilityTypes';

const isSameNight = (left: Date, right: Date) => normalizeDate(left).getTime() === normalizeDate(right).getTime();

export const findBlockedNight = (nights: Date[], availabilities: BlockedAvailability[]) =>
  nights.find((night) => availabilities.some((availability) => isSameNight(availability.date, night)));

const isOrderActiveOnNight = (order: ActiveOrder, night: Date) => {
  const checkIn = normalizeDate(order.check_in_date);
  const checkOut = normalizeDate(order.check_out_date);
  return night >= checkIn && night < checkOut;
};

const countOrdersForNight = (orders: ActiveOrder[], night: Date) =>
  orders.filter((order) => isOrderActiveOnNight(order, night)).length;

export const findFullyBookedNight = (nights: Date[], orders: ActiveOrder[], quantity: number) =>
  nights.find((night) => countOrdersForNight(orders, night) >= quantity);
