import prisma from '../config/prisma';
import { calculateStayDetails } from './pricingService';
import { checkAvailability } from './availabilityService';
import { buildOrderBy, buildPropertyWhere, type PropertyFilters } from './propertyQueryService';

export const getProperties = async (filters: PropertyFilters) => {
  const { page = 1, limit = 12, sort = 'created_at', order = 'desc' } = filters;
  const skip = (Number(page) - 1) * Number(limit);
  const where = buildPropertyWhere(filters);
  const orderBy = buildOrderBy(sort, order);
  const checkIn = filters.check_in_date ? new Date(filters.check_in_date) : null;
  const checkOut = filters.check_out_date ? new Date(filters.check_out_date) : null;
  const useMemFilter = !!(checkIn && checkOut);

  const items = await prisma.property.findMany({
    where, orderBy,
    include: { category: true, rooms: { where: { deleted_at: null } }, reviews: { where: { deleted_at: null }, select: { rating: true } }, _count: { select: { orders: true } } },
    ...(useMemFilter ? {} : { skip, take: Number(limit) })
  });

  const formattedItems = await processPropertyItems(items, checkIn, checkOut, useMemFilter);
  const { finalItems, total } = await getFinalSortedItems(formattedItems, sort, order, skip, Number(limit), useMemFilter, where);

  return { items: finalItems, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } };
};

const processPropertyItems = async (items: any[], checkIn: Date | null, checkOut: Date | null, useMemFilter: boolean) => {
  const formattedItems: any[] = [];
  for (const item of items) {
    const { roomsWithStatus, minPrice, hasAvailable } = await evaluateRooms(item.rooms, checkIn, checkOut);
    if (useMemFilter && !hasAvailable) continue;
    formattedItems.push(buildPropertyPayload(item, checkIn, checkOut, minPrice, roomsWithStatus));
  }
  return formattedItems;
};

const evaluateRooms = async (rooms: any[], checkIn: Date | null, checkOut: Date | null) => {
  let hasAvailable = false;
  let minPrice = Infinity;
  const roomsWithStatus: any[] = [];
  for (const r of rooms) {
    if (!checkIn || !checkOut) { roomsWithStatus.push(r); continue; }
    try {
      const avail = await checkAvailability(r.id, checkIn, checkOut);
      if (avail.available) {
        hasAvailable = true;
        const priceDetails = await calculateStayDetails(r.id, checkIn, checkOut);
        minPrice = Math.min(minPrice, priceDetails.totalPrice);
        roomsWithStatus.push({ ...r, is_available: true, priceDetails });
      }
    } catch { /* ignore */ }
  }
  return { roomsWithStatus, minPrice, hasAvailable };
};

const buildPropertyPayload = (item: any, checkIn: Date | null, checkOut: Date | null, minPrice: number, roomsWithStatus: any[]) => {
  const prices = (checkIn && checkOut) ? [minPrice] : item.rooms.map((r: any) => r.base_price);
  const ratings = item.reviews?.map((r: any) => r.rating) || [];
  const ratingAvg = ratings.length > 0 ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) : undefined;
  return {
    ...item,
    min_price: prices.length > 0 ? Math.min(...prices) : 0,
    rating: ratingAvg ? Math.round(ratingAvg * 10) / 10 : undefined,
    review_count: ratings.length,
    order_count: item._count?.orders ?? 0,
    rooms: roomsWithStatus,
    reviews: undefined,
    _count: undefined,
  };
};

const getFinalSortedItems = async (formattedItems: any[], sort: string, order: string, skip: number, limit: number, useMemFilter: boolean, where: any) => {
  if (sort === 'price') {
    formattedItems.sort((a, b) => order === 'asc' ? a.min_price - b.min_price : b.min_price - a.min_price);
  } else if (sort === 'rating') {
    formattedItems.sort((a, b) => order === 'asc' ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0));
  }
  
  if (useMemFilter || sort === 'price' || sort === 'rating') {
    return { finalItems: formattedItems.slice(skip, skip + limit), total: formattedItems.length };
  }
  return { finalItems: formattedItems, total: await prisma.property.count({ where }) };
};



export const getPropertyDetail = async (id: string, filters?: { check_in_date?: string; check_out_date?: string }) => {
  const property = await prisma.property.findFirst({
    where: { id, deleted_at: null },
    include: {
      category: true, images: { orderBy: { order: 'asc' } },
      rooms: { where: { deleted_at: null } },
      reviews: { where: { deleted_at: null }, include: { user: { select: { name: true, avatar_url: true } }, replies: true }, orderBy: { created_at: 'desc' }, take: 10 }
    },
  });

  if (!property) throw new Error('Properti tidak ditemukan');

  const checkIn = filters?.check_in_date ? new Date(filters.check_in_date) : null;
  const checkOut = filters?.check_out_date ? new Date(filters.check_out_date) : null;

  const roomsWithStatus = await fetchDetailedRoomsStatus(property.rooms, checkIn, checkOut);
  return { ...formatProperty(property), images: property.images, rooms: roomsWithStatus, reviews: property.reviews };
};

const fetchDetailedRoomsStatus = async (rooms: any[], checkIn: Date | null, checkOut: Date | null) => {
  const roomsWithStatus: any[] = [];
  const availabilityRange = getDefaultCalendarRange();
  for (const r of rooms) {
    const roomRel = await prisma.room.findUnique({
      where: { id: r.id },
      include: {
        peakRates: { where: { deleted_at: null } },
        images: { orderBy: { order: 'asc' } },
        availability: {
          where: {
            is_available: false,
            date: { gte: availabilityRange.start, lte: availabilityRange.end },
          },
        },
      }
    });

    if (checkIn && checkOut) {
      roomsWithStatus.push(await buildAvailableRoomStatus(r, roomRel, checkIn, checkOut));
    } else {
      roomsWithStatus.push(buildRoomCalendarPayload(r, roomRel));
    }
  }
  return roomsWithStatus;
};

const buildAvailableRoomStatus = async (room: any, roomRel: any, checkIn: Date, checkOut: Date) => {
  try {
    const avail = await checkAvailability(room.id, checkIn, checkOut);
    if (avail.available) {
      const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
      return { ...buildRoomCalendarPayload(room, roomRel), is_available: avail.available, reason: avail.reason, priceDetails };
    }
  } catch { /* ignore */ }
  return buildRoomCalendarPayload(room, roomRel);
};

const buildRoomCalendarPayload = (room: any, roomRel: any) => {
  const availability = roomRel?.availability || [];
  return { ...room, images: roomRel?.images, peakRates: roomRel?.peakRates, availability, availabilities: availability };
};

const getDefaultCalendarRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0));
  return { start, end };
};

const formatProperty = (p: any) => {
  const prices = p.rooms?.map((r: any) => r.base_price) || [];
  const ratings = p.reviews?.map((r: any) => r.rating) || [];
  const min_price = prices.length > 0 ? Math.min(...prices) : 0;
  const rating = ratings.length > 0 ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) : undefined;
  return {
    ...p,
    min_price,
    rating: rating ? Math.round(rating * 10) / 10 : undefined,
    review_count: ratings.length,
    order_count: p._count?.orders ?? 0,
    rooms: undefined,
    reviews: undefined,
    _count: undefined,
  };
};

export const getCategories = async () => prisma.propertyCategory.findMany();
