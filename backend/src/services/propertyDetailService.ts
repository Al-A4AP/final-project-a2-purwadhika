import prisma from '../config/prisma';
import { calculateStayDetails } from './pricingService';
import { checkAvailability } from './availabilityService';

const propertyInclude = {
  category: true,
  images: { orderBy: { order: 'asc' as const } },
  rooms: { where: { deleted_at: null } },
  reviews: {
    where: { deleted_at: null },
    include: { user: { select: { name: true, avatar_url: true } }, replies: true },
    orderBy: { created_at: 'desc' as const },
    take: 10,
  },
};

const roomRelationInclude = (range: { start: Date; end: Date }) => ({
  peakRates: { where: { deleted_at: null } },
  images: { orderBy: { order: 'asc' as const } },
  availability: { where: { is_available: false, date: { gte: range.start, lte: range.end } } },
});

const parseDateFilters = (filters?: { check_in_date?: string; check_out_date?: string }) => ({
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
  const property = await prisma.property.findFirst({ where: { id, deleted_at: null }, include: propertyInclude });
  if (!property) throw new Error('Properti tidak ditemukan');
  return property;
};

const buildRoomCalendarPayload = (room: any, roomRel: any) => {
  const availability = roomRel?.availability || [];
  return { ...room, images: roomRel?.images, peakRates: roomRel?.peakRates, availability, availabilities: availability };
};

const buildUnavailableRoomStatus = (room: any, roomRel: any, avail: { reason?: string; source?: string }) => ({
  ...buildRoomCalendarPayload(room, roomRel),
  availability_source: avail.source,
  is_available: false,
  reason: avail.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.',
});

const buildAvailableRoomStatus = async (room: any, roomRel: any, checkIn: Date, checkOut: Date) => {
  try {
    const avail = await checkAvailability(room.id, checkIn, checkOut);
    if (!avail.available) return buildUnavailableRoomStatus(room, roomRel, avail);
    const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
    return { ...buildRoomCalendarPayload(room, roomRel), is_available: true, reason: avail.reason, priceDetails };
  } catch { return buildRoomCalendarPayload(room, roomRel); }
};

const buildRoomStatus = async (room: any, checkIn: Date | null, checkOut: Date | null) => {
  const roomRel = await prisma.room.findUnique({ where: { id: room.id }, include: roomRelationInclude(getDefaultCalendarRange()) });
  if (checkIn && checkOut) return buildAvailableRoomStatus(room, roomRel, checkIn, checkOut);
  return buildRoomCalendarPayload(room, roomRel);
};

const fetchDetailedRoomsStatus = (rooms: any[], checkIn: Date | null, checkOut: Date | null) =>
  Promise.all(rooms.map((room) => buildRoomStatus(room, checkIn, checkOut)));

const ratingAverage = (reviews?: { rating: number }[]) => {
  const ratings = reviews?.map((review) => review.rating) || [];
  if (!ratings.length) return undefined;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

const formatProperty = (property: any) => {
  const prices = property.rooms?.map((room: any) => room.base_price) || [];
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

export const getPropertyDetail = async (id: string, filters?: { check_in_date?: string; check_out_date?: string }) => {
  const property = await findProperty(id);
  const { checkIn, checkOut } = parseDateFilters(filters);
  const rooms = await fetchDetailedRoomsStatus(property.rooms, checkIn, checkOut);
  return { ...formatProperty(property), images: property.images, rooms, reviews: property.reviews };
};
