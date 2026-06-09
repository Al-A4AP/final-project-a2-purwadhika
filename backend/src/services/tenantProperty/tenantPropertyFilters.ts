import type { Prisma, Property, RentalType } from '@prisma/client';
import type { GetTenantPropertiesOptions, NormalizedTenantPropertyOptions, PropertyFormData } from './tenantPropertyTypes';

const sortableColumns = new Set(['created_at', 'name', 'city', 'updated_at', 'min_price']);

export const normalizePropertyOptions = (options: GetTenantPropertiesOptions = {}): NormalizedTenantPropertyOptions => ({
  search: options.search,
  categoryId: options.categoryId,
  sortBy: normalizeSortBy(options.sortBy),
  sortOrder: options.sortOrder === 'asc' ? 'asc' : 'desc',
  page: options.page ?? 1,
  limit: options.limit ?? 10,
});

export const buildTenantPropertyWhere = (tenantId: string, options: NormalizedTenantPropertyOptions): Prisma.PropertyWhereInput => ({
  tenantId,
  deleted_at: null,
  ...(options.categoryId ? { categoryId: options.categoryId } : {}),
  ...(options.search ? { OR: buildPropertySearch(options.search) } : {}),
});

export const buildPropertyCreateData = (tenantId: string, data: PropertyFormData, featuredImageUrl?: string): Prisma.PropertyCreateInput => ({
  tenant: { connect: { id: tenantId } },
  category: { connect: { id: data.categoryId } },
  rental_type: (data.rental_type as RentalType) || 'PER_ROOM',
  name: data.name!,
  description: data.description!,
  address: data.address!,
  city: data.city!,
  province: data.province || undefined,
  amenities: parseAmenities(data.amenities),
  ...buildCoordinateData(data),
  featured_image_url: featuredImageUrl,
  ...(data.rental_type === 'WHOLE_PROPERTY' ? {
    rooms: {
      create: {
        room_type: 'Seluruh Properti',
        description: 'Menyewakan seluruh area properti.',
        base_price: 0,
        quantity: 1,
        capacity: 1,
      }
    }
  } : {})
});

export const buildPropertyUpdateData = (data: PropertyFormData, existing: Property, featuredImageUrl?: string) => ({
  ...buildPropertyTextUpdate(data, existing),
  rental_type: (data.rental_type as RentalType) || existing.rental_type,
  amenities: data.amenities !== undefined ? parseAmenities(data.amenities) : existing.amenities,
  ...buildCoordinateUpdate(data, existing),
  featured_image_url: featuredImageUrl,
});

const normalizeSortBy = (sortBy = 'created_at') => sortableColumns.has(sortBy) ? sortBy : 'created_at';
const buildPropertySearch = (search: string): Prisma.PropertyWhereInput[] => [
  { name: { contains: search, mode: 'insensitive' } },
  { address: { contains: search, mode: 'insensitive' } },
  { city: { contains: search, mode: 'insensitive' } },
];
const parseAmenities = (value?: string | string[]) => {
  if (!value) return [];
  const values = Array.isArray(value) ? value : value.split(',');
  return values.map((item) => item.trim()).filter(Boolean);
};
const toOptionalNumber = (value?: string | number | null) => value ? Number(value) : undefined;
const buildCoordinateData = (data: PropertyFormData) => ({
  latitude: toOptionalNumber(data.latitude),
  longitude: toOptionalNumber(data.longitude),
});
const buildCoordinateUpdate = (data: PropertyFormData, existing: Property) => ({
  latitude: data.latitude ? Number(data.latitude) : existing.latitude,
  longitude: data.longitude ? Number(data.longitude) : existing.longitude,
});
const buildPropertyTextUpdate = (data: PropertyFormData, existing: Property) => ({
  categoryId: data.categoryId || existing.categoryId,
  name: data.name || existing.name,
  description: data.description || existing.description,
  address: data.address || existing.address,
  city: data.city || existing.city,
  province: data.province ?? existing.province,
});
