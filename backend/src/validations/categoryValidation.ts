import { z } from 'zod';
import { CATEGORY_DESCRIPTION_MAX_LENGTH } from '../constants/validation';

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Nama kategori minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
  description: z.string().trim().max(CATEGORY_DESCRIPTION_MAX_LENGTH, `Deskripsi maksimal ${CATEGORY_DESCRIPTION_MAX_LENGTH} karakter`).optional(),
  default_rental_type: z.enum(['PER_ROOM', 'WHOLE_PROPERTY']).default('PER_ROOM'),
});

export const categoryQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
  sortBy: z.enum(['name', 'updated_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryQuery = z.infer<typeof categoryQuerySchema>;
