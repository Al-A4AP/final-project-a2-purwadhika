import { z } from "zod";
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
} from "@/constants/validation";

const boundedPositiveInteger = (label: string, max: number) =>
  z.string()
    .regex(/^[1-9]\d*$/, `${label} harus lebih dari 0`)
    .refine((value) => Number(value) <= max, `${label} maksimal ${max}`);

const propertyFormFields = {
  name: z.string().trim().min(3, "Minimal 3 karakter"),
  description: z.string().trim().max(PROPERTY_DESCRIPTION_MAX_LENGTH, `Deskripsi maksimal ${PROPERTY_DESCRIPTION_MAX_LENGTH} karakter`).optional().default(""),
  categoryId: z.string().min(1, "Pilih kategori"),
  rental_type: z.enum(["PER_ROOM", "WHOLE_PROPERTY"]).default("PER_ROOM"),
  whole_property_price: boundedPositiveInteger("Harga sewa", MAX_DAILY_PRICE).optional().or(z.literal("")),
  whole_property_capacity: boundedPositiveInteger("Kapasitas dewasa", MAX_ADULT_CAPACITY).optional().or(z.literal("")),
  address: z.string().trim().min(ADDRESS_MIN_LENGTH, `Alamat minimal ${ADDRESS_MIN_LENGTH} karakter`).max(ADDRESS_MAX_LENGTH, `Alamat maksimal ${ADDRESS_MAX_LENGTH} karakter`),
  city: z.string().trim().min(CITY_MIN_LENGTH, `Kota minimal ${CITY_MIN_LENGTH} karakter`).max(CITY_MAX_LENGTH, `Kota maksimal ${CITY_MAX_LENGTH} karakter`),
  province: z.string().trim().min(PROVINCE_MIN_LENGTH, `Provinsi minimal ${PROVINCE_MIN_LENGTH} karakter`).max(PROVINCE_MAX_LENGTH, `Provinsi maksimal ${PROVINCE_MAX_LENGTH} karakter`),
  amenities: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
};

export const propertyFormSchema = z.object(propertyFormFields)
  .superRefine((data, ctx) => {
    if (data.rental_type !== "WHOLE_PROPERTY") return;
    if (!data.whole_property_price) {
      ctx.addIssue({ code: "custom", message: "Harga sewa seluruh properti wajib diisi", path: ["whole_property_price"] });
    }
    if (!data.whole_property_capacity) {
      ctx.addIssue({ code: "custom", message: "Kapasitas seluruh properti wajib diisi", path: ["whole_property_capacity"] });
    }
  });

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;
