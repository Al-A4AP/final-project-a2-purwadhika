import prisma from '../../config/prisma';
import type { OrderStatus } from '@prisma/client';

const ACTIVE_OCCUPANCY_STATUSES: OrderStatus[] = ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'];
const DAY_IN_MS = 86_400_000;

type MillisecondRange = {
  start: number;
  end: number;
};

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
  const sorted = availability.map((a) => a.date.getTime()).sort((a, b) => a - b);
  return toDateRanges(mergeConsecutiveDates(sorted));
};

const mergeConsecutiveDates = (dates: number[]) =>
  dates.reduce<MillisecondRange[]>((ranges, date) => {
    const currentRange = ranges[ranges.length - 1];
    if (currentRange && date - currentRange.end === DAY_IN_MS) {
      currentRange.end = date;
    } else {
      ranges.push({ start: date, end: date });
    }
    return ranges;
  }, []);

const toDateRanges = (ranges: MillisecondRange[]) =>
  ranges.map(({ start, end }) => ({
    start_date: new Date(start),
    end_date: new Date(end),
  }));

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
