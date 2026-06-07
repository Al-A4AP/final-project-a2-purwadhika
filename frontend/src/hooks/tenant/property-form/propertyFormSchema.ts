import { z } from "zod";

export const propertyFormSchema = z.object({
  name: z.string().min(3, "Minimal 3 karakter"),
  description: z.string().min(20, "Minimal 20 karakter"),
  categoryId: z.string().min(1, "Pilih kategori"),
  rental_type: z.enum(["PER_ROOM", "WHOLE_PROPERTY"]).default("PER_ROOM"),
  address: z.string().min(5, "Alamat wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  province: z.string().optional(),
  amenities: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;
