import { z } from 'zod';

export const searchFormSchema = z.object({
  city: z.string().optional(),
  check_in_date: z.string().optional(),
  check_out_date: z.string().optional(),
  adults: z.coerce.number().min(1, 'Minimal 1 dewasa').max(20),
  children: z.coerce.number().min(0).max(20),
  babies: z.coerce.number().min(0).max(10),
}).refine(
  (data) => !data.check_in_date || !data.check_out_date || new Date(data.check_out_date) > new Date(data.check_in_date),
  {
    message: 'Tanggal check-out harus lebih besar dari check-in',
    path: ['check_out_date'],
  }
);

export type SearchFormInput = z.infer<typeof searchFormSchema>;

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  sort: z.enum(['name', 'price', 'created_at']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
});
