import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const revenuePeriods = ['weekly', 'monthly', 'quarterly', 'six_months', 'yearly', 'all_time'] as const;
const orderDirections = ['asc', 'desc'] as const;
const orderSortFields = ['created_at', 'check_in_date', 'check_out_date', 'total_price', 'order_number'] as const;

const cleanScalar = (value: unknown) => {
  const scalar = Array.isArray(value) ? value[0] : value;
  if (scalar === null || scalar === undefined) return undefined;
  if (typeof scalar !== 'string') return scalar;
  const trimmed = scalar.trim();
  return trimmed || undefined;
};

const cleanAmenities = (value: unknown) => {
  if (value === null || value === undefined || value === '') return undefined;
  if (!Array.isArray(value)) return cleanScalar(value);
  return value.map(cleanScalar).filter(Boolean);
};

const optionalString = () =>
  z.preprocess(cleanScalar, z.string().optional());

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(cleanScalar, z.enum(values).optional());

const optionalPositiveInt = (max: number) =>
  z.preprocess(cleanScalar, z.coerce.number().int().positive().max(max).optional());

const optionalNonNegativeNumber = () =>
  z.preprocess(cleanScalar, z.coerce.number().min(0).optional());

const optionalDateString = () =>
  z.preprocess(cleanScalar, z.string().refine(isValidDate, 'Format tanggal tidak valid').optional());

const isValidDate = (value: string) =>
  !Number.isNaN(Date.parse(value));

const optionalOrderStatus = () =>
  z.preprocess(cleanScalar, z.nativeEnum(OrderStatus).optional());

const optionalBooleanString = () =>
  z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : undefined, z.boolean().optional());

export const propertyListQuerySchema = z.object({
  page: optionalPositiveInt(100),
  limit: optionalPositiveInt(100),
  sort: optionalEnum(['created_at', 'name', 'price', 'rating', 'popularity'] as const),
  order: optionalEnum(orderDirections),
  search: optionalString(),
  category: optionalString(),
  city: optionalString(),
  check_in_date: optionalDateString(),
  check_out_date: optionalDateString(),
  capacity: optionalPositiveInt(100),
  adults: optionalPositiveInt(100),
  children: optionalNonNegativeNumber(),
  babies: optionalNonNegativeNumber(),
  min_price: optionalNonNegativeNumber(),
  max_price: optionalNonNegativeNumber(),
  amenities: z.preprocess(cleanAmenities, z.union([z.string(), z.array(z.string())]).optional()),
});

export const propertyDetailQuerySchema = z.object({
  check_in_date: optionalDateString(),
  check_out_date: optionalDateString(),
});

export const publicAvailabilityQuerySchema = z.object({
  start_date: optionalDateString(),
  end_date: optionalDateString(),
});

export const geocodeQuerySchema = z.object({
  address: z.preprocess(cleanScalar, z.string().min(3, 'Alamat minimal 3 karakter')),
});

export const reverseGeocodeQuerySchema = z.object({
  lat: z.preprocess(cleanScalar, z.coerce.number().min(-90).max(90)),
  lon: z.preprocess(cleanScalar, z.coerce.number().min(-180).max(180)),
});

export const userOrderQuerySchema = z.object({
  check_in_date: optionalDateString(),
  check_out_date: optionalDateString(),
  endDate: optionalDateString(),
  orderNumber: optionalString(),
  startDate: optionalDateString(),
  status: optionalOrderStatus(),
  sortBy: optionalEnum(orderSortFields),
  sortOrder: optionalEnum(orderDirections),
  page: optionalPositiveInt(100),
  limit: optionalPositiveInt(100),
  has_review: optionalBooleanString(),
});

export const tenantOrderQuerySchema = z.object({
  propertyId: optionalString(),
  status: optionalOrderStatus(),
  startDate: optionalDateString(),
  endDate: optionalDateString(),
  sortBy: optionalEnum(orderSortFields),
  sortOrder: optionalEnum(orderDirections),
  page: optionalPositiveInt(100),
  limit: optionalPositiveInt(100),
});

export const tenantReportQuerySchema = z.object({
  startDate: optionalDateString(),
  endDate: optionalDateString(),
  propertyId: optionalString(),
  revenuePeriod: optionalEnum(revenuePeriods),
  status: optionalOrderStatus(),
  sortBy: optionalEnum(['created_at', 'total_price'] as const),
  sortOrder: optionalEnum(orderDirections),
  userName: optionalString(),
  page: optionalPositiveInt(100),
  limit: optionalPositiveInt(100),
});

export const tenantDashboardQuerySchema = z.object({
  revenuePeriod: optionalEnum(revenuePeriods),
});

export const tenantPropertyQuerySchema = z.object({
  search: optionalString(),
  categoryId: optionalString(),
  sortBy: optionalEnum(['created_at', 'name', 'city', 'updated_at', 'min_price'] as const),
  sortOrder: optionalEnum(orderDirections),
  page: optionalPositiveInt(100),
  limit: optionalPositiveInt(100),
});

export const tenantReviewQuerySchema = z.object({
  page: optionalPositiveInt(100),
  limit: optionalPositiveInt(100),
});
