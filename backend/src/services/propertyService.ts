import prisma from '../config/prisma';
import { calculateStayDetails } from './pricingService';
import { checkAvailability } from './availabilityService';

interface PropertyFilters {
  page?: number; limit?: number; sort?: string; order?: string;
  search?: string; category?: string; city?: string;
  check_in_date?: string; check_out_date?: string; capacity?: number;
}

export const getProperties = async (filters: PropertyFilters) => {
  const { page = 1, limit = 12, sort = 'created_at', order = 'desc', search, category, city } = filters;
  const skip = (Number(page) - 1) * Number(limit);
  const where = buildPropertyWhere(filters);
  const orderBy = buildOrderBy(sort, order);

  const checkIn = filters.check_in_date ? new Date(filters.check_in_date) : null;
  const checkOut = filters.check_out_date ? new Date(filters.check_out_date) : null;
  const useInMemoryFilter = !!(checkIn && checkOut);

  const items = await prisma.property.findMany({
    where,
    orderBy,
    include: {
      category: true,
      rooms: { where: { deleted_at: null } },
      reviews: { where: { deleted_at: null }, select: { rating: true } },
      _count: { select: { orders: true } },
    },
    ...(useInMemoryFilter ? {} : { skip, take: Number(limit) })
  });

  const formattedItems: any[] = [];
  for (const item of items) {
    let hasAvailableRoom = false;
    let minPrice = Infinity;
    const roomsWithStatus: any[] = [];

    for (const r of item.rooms) {
      if (checkIn && checkOut) {
        try {
          const avail = await checkAvailability(r.id, checkIn, checkOut);
          if (avail.available) {
            hasAvailableRoom = true;
            const priceDetails = await calculateStayDetails(r.id, checkIn, checkOut);
            minPrice = Math.min(minPrice, priceDetails.totalPrice);
            roomsWithStatus.push({ ...r, is_available: true, priceDetails });
          }
        } catch (e) {
          // ignore error, room is just not pushed
        }
      } else {
        roomsWithStatus.push(r);
      }
    }

    if (useInMemoryFilter && !hasAvailableRoom) {
      continue;
    }

    const prices = (checkIn && checkOut) ? [minPrice] : item.rooms.map((r: any) => r.base_price);
    const ratings = item.reviews?.map((r: any) => r.rating) || [];
    const min_price = prices.length > 0 ? Math.min(...prices) : 0;
    const rating = ratings.length > 0 ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) : undefined;

    formattedItems.push({
      ...item,
      min_price,
      rating: rating ? Math.round(rating * 10) / 10 : undefined,
      review_count: ratings.length,
      order_count: item._count?.orders ?? 0,
      rooms: roomsWithStatus,
      reviews: undefined,
      _count: undefined,
    });
  }

  // In-memory sort for price & rating (unsupported by Prisma orderBy)
  if (sort === 'price') {
    formattedItems.sort((a, b) => order === 'asc' ? a.min_price - b.min_price : b.min_price - a.min_price);
  } else if (sort === 'rating') {
    formattedItems.sort((a, b) => order === 'asc' ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0));
  }

  let finalItems = formattedItems;
  let total = 0;
  if (useInMemoryFilter || sort === 'price' || sort === 'rating') {
    total = formattedItems.length;
    finalItems = formattedItems.slice(skip, skip + Number(limit));
  } else {
    total = await prisma.property.count({ where });
  }
  return {
    items: finalItems,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  };
};

export const getPropertyDetail = async (id: string, filters?: { check_in_date?: string; check_out_date?: string }) => {
  const property = await prisma.property.findFirst({
    where: { id, deleted_at: null },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      rooms: {
        where: { deleted_at: null },
      },
      reviews: {
        where: { deleted_at: null },
        include: { user: { select: { name: true, avatar_url: true } }, replies: true },
        orderBy: { created_at: 'desc' },
        take: 10,
      },
    },
  });

  if (!property) throw new Error('Properti tidak ditemukan');

  const checkIn = filters?.check_in_date ? new Date(filters.check_in_date) : null;
  const checkOut = filters?.check_out_date ? new Date(filters.check_out_date) : null;

  const roomsWithStatus: any[] = [];
  for (const r of property.rooms) {
    // get peak rates and availabilities for calendar
    const roomWithRelations = await prisma.room.findUnique({
      where: { id: r.id },
      include: {
        peakRates: { where: { deleted_at: null } },
        availability: { where: { is_available: false, date: { gte: new Date() } } }
      }
    });

    if (checkIn && checkOut) {
      try {
        const avail = await checkAvailability(r.id, checkIn, checkOut);
        if (avail.available) {
          const priceDetails = await calculateStayDetails(r.id, checkIn, checkOut);
          roomsWithStatus.push({
            ...r,
            is_available: avail.available,
            reason: avail.reason,
            priceDetails,
            peakRates: roomWithRelations?.peakRates,
            availability: roomWithRelations?.availability
          });
        }
      } catch (e: any) {
        // ignore error, room is just not pushed
      }
    } else {
      roomsWithStatus.push({
        ...r,
        peakRates: roomWithRelations?.peakRates,
        availability: roomWithRelations?.availability
      });
    }
  }

  const formatted = formatProperty(property);
  return { ...formatted, images: property.images, rooms: roomsWithStatus, reviews: property.reviews };
};

const buildPropertyWhere = (filters: PropertyFilters) => {
  const where: any = { deleted_at: null };
  if (filters.search) where.name = { contains: filters.search, mode: 'insensitive' };
  if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
  if (filters.category) where.category = { name: { contains: filters.category, mode: 'insensitive' } };
  if (filters.capacity) where.rooms = { some: { capacity: { gte: Number(filters.capacity) }, deleted_at: null } };
  return where;
};

const buildOrderBy = (sort: string, order: string) => {
  const dbSorts: Record<string, unknown> = {
    name: { name: order },
    created_at: { created_at: order },
    popularity: { orders: { _count: order } },
  };
  // price & rating are sorted in-memory after formatting
  return dbSorts[sort] || { created_at: 'desc' };
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
