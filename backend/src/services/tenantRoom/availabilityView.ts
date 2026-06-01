import { buildNights, formatDateKey, normalizeStayRange } from '../availability/availabilityDates';

interface ManualAvailability {
  date: Date;
  id: string;
  is_available: boolean;
  roomId: string;
}

interface BookedOrder {
  check_in_date: Date;
  check_out_date: Date;
  id: string;
  roomId: string;
}

export const buildTenantAvailabilityView = (
  manual: ManualAvailability[],
  orders: BookedOrder[],
) => [...manual.map(markManualAvailability), ...orders.flatMap(buildBookedAvailability)];

const markManualAvailability = (availability: ManualAvailability) => ({
  ...availability,
  source: availability.is_available ? 'TENANT_AVAILABLE' : 'TENANT_BLOCKED',
});

const buildBookedAvailability = (order: BookedOrder) =>
  buildNights(normalizeStayRange(order.check_in_date, order.check_out_date))
    .map((date) => buildBookedDay(order, date));

const buildBookedDay = (order: BookedOrder, date: Date) => ({
  date: formatDateKey(date),
  id: `booked-${order.id}-${formatDateKey(date)}`,
  is_available: false,
  orderId: order.id,
  roomId: order.roomId,
  source: 'CUSTOMER_BOOKED',
});
