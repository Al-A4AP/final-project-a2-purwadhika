import { buildNights, formatDateKey, normalizeStayRange } from './availability/availabilityDates';

interface CalendarAvailability {
  date: Date;
  id: string;
  is_available: boolean;
  roomId: string;
}

interface CalendarOrder {
  check_in_date: Date;
  check_out_date: Date;
  id: string;
  roomId: string;
}

interface CalendarRoom {
  id: string;
  quantity: number;
}

interface CalendarRange {
  end: Date;
  start: Date;
}

export const buildRoomCalendarAvailability = (
  room: CalendarRoom,
  manual: CalendarAvailability[],
  orders: CalendarOrder[],
  range: CalendarRange,
) => [...manual.map(markTenantAvailability), ...buildFullBookedDays(room, orders, range)];

const markTenantAvailability = (availability: CalendarAvailability) => ({
  ...availability,
  source: availability.is_available ? 'TENANT_AVAILABLE' : 'TENANT_BLOCKED',
});

const buildFullBookedDays = (room: CalendarRoom, orders: CalendarOrder[], range: CalendarRange) =>
  getFullBookedDates(orders, room.quantity, range)
    .map(([date]) => buildBookedAvailability(room.id, date));

const getFullBookedDates = (orders: CalendarOrder[], quantity: number, range: CalendarRange) =>
  [...countBookedNights(orders).entries()]
    .filter(([date]) => isDateInRange(date, range))
    .filter(([, count]) => count >= quantity);

const isDateInRange = (date: string, range: CalendarRange) =>
  date >= formatDateKey(range.start) && date <= formatDateKey(range.end);

const countBookedNights = (orders: CalendarOrder[]) =>
  orders.reduce((counts, order) => addOrderNights(counts, order), new Map<string, number>());

const addOrderNights = (counts: Map<string, number>, order: CalendarOrder) => {
  buildNights(normalizeStayRange(order.check_in_date, order.check_out_date))
    .forEach((date) => incrementCount(counts, formatDateKey(date)));
  return counts;
};

const incrementCount = (counts: Map<string, number>, key: string) =>
  counts.set(key, (counts.get(key) || 0) + 1);

const buildBookedAvailability = (roomId: string, date: string) => ({
  date,
  id: `customer-booked-${roomId}-${date}`,
  is_available: false,
  roomId,
  source: 'CUSTOMER_BOOKED',
});
