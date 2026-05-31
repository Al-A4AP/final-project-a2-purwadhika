import { z } from 'zod';

export const createPropertySchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  address: z.string().min(5, 'Alamat wajib diisi'),
  city: z.string().min(2, 'Kota wajib diisi'),
  province: z.string().optional(),
  amenities: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

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
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: "Tanggal selesai harus setelah tanggal mulai",
  path: ["end_date"]
});
