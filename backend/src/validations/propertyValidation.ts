import { z } from 'zod';
import {
  ADDRESS_MAX_LENGTH,
  ADDRESS_MIN_LENGTH,
  CITY_MAX_LENGTH,
  CITY_MIN_LENGTH,
  PROVINCE_MAX_LENGTH,
  PROVINCE_MIN_LENGTH,
  PROPERTY_DESCRIPTION_MAX_LENGTH,
  MAX_ADULT_CAPACITY,
  MAX_DAILY_PRICE,
} from '../constants/validation';

const propertyDescriptionSchema = z.string().trim().max(PROPERTY_DESCRIPTION_MAX_LENGTH, `Deskripsi maksimal ${PROPERTY_DESCRIPTION_MAX_LENGTH} karakter`);
const positiveIntegerString = (label: string) =>
  z.string().regex(/^[1-9]\d*$/, `${label} harus lebih dari 0`);
const boundedPositiveIntegerString = (label: string, max: number) =>
  positiveIntegerString(label).refine((value) => Number(value) <= max, `${label} maksimal ${max}`);

const propertyFields = {
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  description: propertyDescriptionSchema.optional().default(''),
  address: z.string().trim().min(ADDRESS_MIN_LENGTH, `Alamat minimal ${ADDRESS_MIN_LENGTH} karakter`).max(ADDRESS_MAX_LENGTH, `Alamat maksimal ${ADDRESS_MAX_LENGTH} karakter`),
  city: z.string().trim().min(CITY_MIN_LENGTH, `Kota minimal ${CITY_MIN_LENGTH} karakter`).max(CITY_MAX_LENGTH, `Kota maksimal ${CITY_MAX_LENGTH} karakter`),
  province: z.string().trim().min(PROVINCE_MIN_LENGTH, `Provinsi minimal ${PROVINCE_MIN_LENGTH} karakter`).max(PROVINCE_MAX_LENGTH, `Provinsi maksimal ${PROVINCE_MAX_LENGTH} karakter`),
  amenities: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  rental_type: z.enum(['PER_ROOM', 'WHOLE_PROPERTY']).default('PER_ROOM'),
  whole_property_price: boundedPositiveIntegerString('Harga sewa', MAX_DAILY_PRICE).optional(),
  whole_property_capacity: boundedPositiveIntegerString('Kapasitas dewasa', MAX_ADULT_CAPACITY).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
};

const requireWholePropertyValues = (
  data: { rental_type?: string; whole_property_capacity?: string; whole_property_price?: string },
  ctx: z.RefinementCtx,
) => {
  if (data.rental_type !== 'WHOLE_PROPERTY') return;
  if (!data.whole_property_price) {
    ctx.addIssue({ code: 'custom', message: 'Harga sewa seluruh properti wajib diisi', path: ['whole_property_price'] });
  }
  if (!data.whole_property_capacity) {
    ctx.addIssue({ code: 'custom', message: 'Kapasitas seluruh properti wajib diisi', path: ['whole_property_capacity'] });
  }
};

export const createPropertySchema = z.object(propertyFields)
  .superRefine(requireWholePropertyValues);

export const updatePropertySchema = z.object(propertyFields).partial().extend({
  description: propertyDescriptionSchema.optional(),
  featured_image_url: z.string().optional(),
}).superRefine(requireWholePropertyValues);

export const createRoomSchema = z.object({
  room_type: z.string().trim().min(3, 'Tipe kamar minimal 3 karakter'),
  base_price: boundedPositiveIntegerString('Harga per malam', MAX_DAILY_PRICE),
  child_price: boundedPositiveIntegerString('Harga anak per malam', MAX_DAILY_PRICE).optional().or(z.literal('')),
  capacity: boundedPositiveIntegerString('Kapasitas dewasa', MAX_ADULT_CAPACITY),
  quantity: z.string()
    .regex(/^[1-9]\d*$/, 'Jumlah kamar harus minimal 1')
    .refine((value) => Number(value) <= 20, 'Stok kamar maksimal 20.')
    .optional(),
  description: z.string().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const peakRateSchema = z.object({
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
  rate_type: z.enum(['PERCENTAGE', 'NOMINAL']),
  rate_value: z.string().regex(/^\d+$/, 'Nilai rate harus berupa angka'),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(data.start_date) < today) {
    ctx.addIssue({ code: 'custom', message: 'Tanggal mulai tidak boleh di masa lalu', path: ['start_date'] });
  }
  if (new Date(data.end_date) < new Date(data.start_date)) {
    ctx.addIssue({ code: 'custom', message: 'Tanggal selesai tidak boleh sebelum tanggal mulai', path: ['end_date'] });
  }
});

export const availabilityRangeSchema = z.object({
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
  is_available: z.boolean(),
}).refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
  message: 'Tanggal selesai tidak boleh sebelum tanggal mulai',
  path: ['end_date'],
});

export const updateRoomImageSchema = z.object({
  is_main: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});
