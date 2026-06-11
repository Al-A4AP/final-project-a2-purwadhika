import prisma from '../../config/prisma';
import type { OrderStatus } from '@prisma/client';

const ACTIVE_OCCUPANCY_STATUSES: OrderStatus[] = ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'];

export const findOccupancyCalendar = async (tenantId: string) => {
  const properties = await prisma.property.findMany({
    where: { tenantId, deleted_at: null },
    select: {
      id: true,
      name: true,
      rental_type: true,
      rooms: { where: { deleted_at: null }, select: buildRoomOccupancySelect() },
    },
  });

  return properties.map((p) => {
    const isWhole = p.rental_type === 'WHOLE_PROPERTY';
    const allOrders = isWhole ? Array.from(new Map(p.rooms.flatMap((r) => r.orders).map((o) => [o.id, o])).values()) : [];
    const allAvailability = isWhole ? p.rooms.flatMap((r) => r.availability) : [];

    return {
      ...p,
      rooms: p.rooms.map((r) => ({
        id: r.id,
        room_type: r.room_type,
        orders: isWhole ? allOrders : r.orders,
        peakRateRanges: r.peakRates,
        blockedRanges: mergeAvailabilityToRanges(isWhole ? allAvailability : r.availability),
      })),
    };
  });
};

const mergeAvailabilityToRanges = (availability: { date: Date }[]) => {
  if (availability.length === 0) return [];
  const sorted = availability.map((a) => a.date.getTime()).sort((a, b) => a - b);
  const ranges: { start_date: Date; end_date: Date }[] = [];
  let currentStart = sorted[0]!;
  let currentEnd = sorted[0]!;

  for (let i = 1; i < sorted.length; i++) {
    const time = sorted[i]!;
    if (time - currentEnd === 86400000) {
      currentEnd = time;
    } else {
      ranges.push({ start_date: new Date(currentStart), end_date: new Date(currentEnd) });
      currentStart = time;
      currentEnd = time;
    }
  }
  ranges.push({ start_date: new Date(currentStart), end_date: new Date(currentEnd) });
  return ranges;
};

const buildRoomOccupancySelect = () => ({
  id: true,
  orders: { where: buildActiveOrderWhere(), select: buildOrderOccupancySelect() },
  peakRates: { where: buildActivePeakRateWhere(), select: buildPeakRateOccupancySelect() },
  availability: { where: buildActiveBlockedWhere(), select: buildBlockedOccupancySelect() },
  room_type: true,
});

const buildActiveOrderWhere = () => ({
  check_out_date: { gte: startOfToday() },
  status: { in: ACTIVE_OCCUPANCY_STATUSES },
});

const buildOrderOccupancySelect = () => ({
  check_in_date: true,
  check_out_date: true,
  id: true,
  order_number: true,
  user: { select: { name: true } },
});

const buildActivePeakRateWhere = () => ({
  end_date: { gte: startOfToday() },
  deleted_at: null,
});

const buildPeakRateOccupancySelect = () => ({
  start_date: true,
  end_date: true,
  rate_type: true,
  rate_value: true,
});

const buildActiveBlockedWhere = () => ({
  date: { gte: startOfToday() },
  is_available: false,
});

const buildBlockedOccupancySelect = () => ({
  date: true,
});

const startOfToday = () => {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value;
};
