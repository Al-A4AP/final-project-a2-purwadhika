import { z } from 'zod';

export const createPropertySchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  address: z.string().min(5, 'Alamat wajib diisi'),
  city: z.string().min(2, 'Kota wajib diisi'),
  province: z.string().optional(),
  amenities: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  rental_type: z.enum(['PER_ROOM', 'WHOLE_PROPERTY']).default('PER_ROOM'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  featured_image_url: z.string().optional(),
});

export const createRoomSchema = z.object({
  room_type: z.string().min(3, 'Tipe kamar minimal 3 karakter'),
  base_price: z.string().regex(/^\d+$/, 'Harga harus berupa angka'),
  child_price: z.string().regex(/^\d+$/, 'Harga anak harus berupa angka').optional().or(z.literal('')),
  capacity: z.string().regex(/^\d+$/, 'Kapasitas harus berupa angka'),
  quantity: z.string().regex(/^\d+$/, 'Jumlah kamar harus berupa angka').optional(),
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
  if (new Date(data.end_date) <= new Date(data.start_date)) {
    ctx.addIssue({ code: 'custom', message: 'Tanggal selesai harus setelah tanggal mulai', path: ['end_date'] });
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
