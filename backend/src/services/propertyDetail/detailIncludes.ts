import type { OrderStatus } from "@prisma/client";
import type { RoomCalendarRange } from "./detailTypes";

const CALENDAR_BOOKING_STATUSES: OrderStatus[] = [
  "WAITING_PAYMENT",
  "WAITING_CONFIRMATION",
  "PROCESSED",
  "COMPLETED",
];

const orderSelect = {
  check_in_date: true,
  check_out_date: true,
  id: true,
  roomId: true,
};

export const propertyInclude = {
  category: true,
  images: { orderBy: { order: "asc" as const } },
  rooms: { where: { deleted_at: null } },
  reviews: {
    where: { deleted_at: null },
    include: { user: { select: { name: true, avatar_url: true } }, replies: true },
    orderBy: { created_at: "desc" as const },
    take: 10,
  },
};

const getAvailabilityInclude = (range: RoomCalendarRange) => ({
  where: { is_available: false, date: { gte: range.start, lte: range.end } },
});

const getOrdersInclude = (range: RoomCalendarRange) => ({
  where: {
    deleted_at: null,
    status: { in: CALENDAR_BOOKING_STATUSES },
    check_in_date: { lte: range.end },
    check_out_date: { gt: range.start },
  },
  select: orderSelect,
});

export const roomRelationInclude = (range: RoomCalendarRange) => ({
  availability: getAvailabilityInclude(range),
  images: { orderBy: { order: "asc" as const } },
  orders: getOrdersInclude(range),
  peakRates: { where: { deleted_at: null } },
});
