import prisma from '../config/prisma';

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

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
      include: {
        category: true,
        rooms: { where: { deleted_at: null }, select: { base_price: true } },
        reviews: { where: { deleted_at: null }, select: { rating: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items: items.map(formatProperty),
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  };
};

export const getPropertyDetail = async (id: string) => {
  const property = await prisma.property.findFirst({
    where: { id, deleted_at: null },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      rooms: {
        where: { deleted_at: null },
        include: { peakRates: { where: { deleted_at: null } } },
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
  return { ...formatProperty(property), images: property.images, rooms: property.rooms, reviews: property.reviews };
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
  const validSorts: any = { name: { name: order }, created_at: { created_at: order }, price: { rooms: { _min: { base_price: order } } } };
  return validSorts[sort] || { created_at: 'desc' };
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
    rooms: undefined,
    reviews: undefined,
  };
};

export const getCategories = async () => prisma.propertyCategory.findMany();
