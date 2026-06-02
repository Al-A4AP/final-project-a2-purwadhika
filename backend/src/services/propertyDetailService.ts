import prisma from "../config/prisma";
import type { OrderStatus } from "@prisma/client";
import { calculateStayDetails } from "./pricingService";
import { checkAvailability } from "./availabilityService";
import { buildRoomCalendarAvailability } from "./propertyDetailCalendar";

type RatingReview = { rating: number };

type RoomRecord = {
  id: string;
  quantity: number;
  base_price?: number;
  [key: string]: unknown;
};

type RoomCalendarAvailability = {
  date: Date;
  id: string;
  is_available: boolean;
  roomId: string;
  source?: string;
};

type RoomCalendarOrder = {
  check_in_date: Date;
  check_out_date: Date;
  id: string;
  roomId: string;
};

type RoomRelation = {
  peakRates?: unknown[];
  images?: unknown[];
  availability?: RoomCalendarAvailability[];
  orders?: RoomCalendarOrder[];
};

interface PropertyDetailFilters {
  check_in_date?: string;
  check_out_date?: string;
}

interface PropertyRecord {
  rooms?: RoomRecord[];
  reviews?: RatingReview[];
  _count?: { orders: number };
  images?: unknown[];
  [key: string]: unknown;
}

interface RoomCalendarRange {
  start: Date;
  end: Date;
}

interface AvailabilityReason {
  reason?: string;
  source?: string;
}

const CALENDAR_BOOKING_STATUSES: OrderStatus[] = [
  "WAITING_PAYMENT",
  "WAITING_CONFIRMATION",
  "PROCESSED",
  "COMPLETED",
];

const propertyInclude = {
  category: true,
  images: { orderBy: { order: "asc" as const } },
  rooms: { where: { deleted_at: null } },
  reviews: {
    where: { deleted_at: null },
    include: {
      user: { select: { name: true, avatar_url: true } },
      replies: true,
    },
    orderBy: { created_at: "desc" as const },
    take: 10,
  },
};

const roomRelationInclude = (range: { start: Date; end: Date }) => ({
  peakRates: { where: { deleted_at: null } },
  images: { orderBy: { order: "asc" as const } },
  availability: {
    where: { is_available: false, date: { gte: range.start, lte: range.end } },
  },
  orders: {
    where: {
      deleted_at: null,
      status: { in: CALENDAR_BOOKING_STATUSES },
      check_in_date: { lte: range.end },
      check_out_date: { gt: range.start },
    },
    select: {
      check_in_date: true,
      check_out_date: true,
      id: true,
      roomId: true,
    },
  },
});

const parseDateFilters = (filters?: {
  check_in_date?: string;
  check_out_date?: string;
}) => ({
  checkIn: filters?.check_in_date ? new Date(filters.check_in_date) : null,
  checkOut: filters?.check_out_date ? new Date(filters.check_out_date) : null,
});

const getDefaultCalendarRange = () => {
  const now = new Date();
  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0)),
  };
};

const findProperty = async (id: string) => {
  const property = await prisma.property.findFirst({
    where: { id, deleted_at: null },
    include: propertyInclude,
  });
  if (!property) throw new Error("Properti tidak ditemukan");
  return property;
};

const buildRoomCalendarPayload = (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
) => {
  const availability = buildRoomCalendarAvailability(
    room,
    roomRel?.availability || [],
    roomRel?.orders || [],
    range,
  );
  return {
    ...room,
    images: roomRel?.images,
    peakRates: roomRel?.peakRates,
    availability,
    availabilities: availability,
  };
};

const buildUnavailableRoomStatus = (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
  avail: AvailabilityReason,
) => ({
  ...buildRoomCalendarPayload(room, roomRel, range),
  availability_source: avail.source,
  is_available: false,
  reason: avail.reason || "Kamar tidak tersedia pada tanggal yang dipilih.",
});

const buildAvailableRoomStatus = async (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
  checkIn: Date,
  checkOut: Date,
) => {
  try {
    const avail = await checkAvailability(room.id, checkIn, checkOut);
    if (!avail.available)
      return buildUnavailableRoomStatus(room, roomRel, range, avail);
    const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
    return {
      ...buildRoomCalendarPayload(room, roomRel, range),
      is_available: true,
      reason: avail.reason,
      priceDetails,
    };
  } catch {
    return buildRoomCalendarPayload(room, roomRel, range);
  }
};

const buildRoomStatus = async (
  room: RoomRecord,
  checkIn: Date | null,
  checkOut: Date | null,
) => {
  const range = getDefaultCalendarRange();
  const roomRel = await prisma.room.findUnique({
    where: { id: room.id },
    include: roomRelationInclude(range),
  });
  if (checkIn && checkOut)
    return buildAvailableRoomStatus(room, roomRel, range, checkIn, checkOut);
  return buildRoomCalendarPayload(room, roomRel, range);
};

const fetchDetailedRoomsStatus = (
  rooms: RoomRecord[],
  checkIn: Date | null,
  checkOut: Date | null,
) => Promise.all(rooms.map((room) => buildRoomStatus(room, checkIn, checkOut)));

const ratingAverage = (reviews?: RatingReview[]) => {
  const ratings = reviews?.map((review) => review.rating) || [];
  if (!ratings.length) return undefined;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

const formatProperty = (property: PropertyRecord) => {
  const prices = property.rooms?.map((room) => room.base_price) || [];
  const rating = ratingAverage(property.reviews);
  return {
    ...property,
    min_price: prices.length ? Math.min(...prices) : 0,
    rating: rating ? Math.round(rating * 10) / 10 : undefined,
    review_count: property.reviews?.length || 0,
    order_count: property._count?.orders ?? 0,
    rooms: undefined,
    reviews: undefined,
    _count: undefined,
  };
};

export const getPropertyDetail = async (
  id: string,
  filters?: PropertyDetailFilters,
) => {
  const property = await findProperty(id);
  const { checkIn, checkOut } = parseDateFilters(filters);
  const rooms = await fetchDetailedRoomsStatus(
    property.rooms,
    checkIn,
    checkOut,
  );
  return {
    ...formatProperty(property),
    images: property.images,
    rooms,
    reviews: property.reviews,
  };
};
