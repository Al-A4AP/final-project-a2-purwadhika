export interface PropertyFilters {
  page?: number; limit?: number; sort?: string; order?: string;
  search?: string; category?: string; city?: string;
  check_in_date?: string; check_out_date?: string; capacity?: number;
  min_price?: number; max_price?: number; amenities?: string | string[];
  adults?: number; children?: number; babies?: number;
}

export const buildPropertyWhere = (filters: PropertyFilters) => {
  const where: any = { deleted_at: null };
  if (filters.search) where.name = { contains: filters.search, mode: 'insensitive' };
  if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
  if (filters.category) where.category = { name: { contains: filters.category, mode: 'insensitive' } };
  const amenities = parseAmenities(filters.amenities);
  if (amenities.length) where.amenities = { hasEvery: amenities };
  const roomWhere = buildRoomFilter(filters);
  if (Object.keys(roomWhere).length) where.rooms = { some: roomWhere };
  return where;
};

export const buildOrderBy = (sort: string, order: string) => {
  const dbSorts: Record<string, unknown> = {
    name: { name: order },
    created_at: { created_at: order },
  };
  return dbSorts[sort] || { created_at: 'desc' };
};

const buildRoomFilter = (filters: PropertyFilters) => {
  const roomWhere: any = {};
  const capacity = Number(filters.capacity || Number(filters.adults || 0) + Number(filters.children || 0));
  const minPrice = toNonNegative(filters.min_price);
  const maxPrice = toNonNegative(filters.max_price);
  if (capacity > 0) roomWhere.capacity = { gte: capacity };
  if (minPrice !== undefined || maxPrice !== undefined) roomWhere.base_price = {};
  if (minPrice !== undefined) roomWhere.base_price.gte = minPrice;
  if (maxPrice !== undefined) roomWhere.base_price.lte = maxPrice;
  if (Object.keys(roomWhere).length) roomWhere.deleted_at = null;
  return roomWhere;
};

const toNonNegative = (value?: number) => {
  if (value === undefined || Number.isNaN(Number(value))) return undefined;
  return Math.max(0, Number(value));
};

const parseAmenities = (amenities?: string | string[]) => {
  if (!amenities) return [];
  const values = Array.isArray(amenities) ? amenities : amenities.split(',');
  return values.map((item) => item.trim()).filter(Boolean);
};
