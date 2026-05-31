import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Nama kategori minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
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
