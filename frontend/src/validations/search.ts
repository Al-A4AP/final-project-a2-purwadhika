import { z } from 'zod';
import { MAX_ADULT_CAPACITY } from '@/constants/validation';

export const searchFormSchema = z.object({
  city: z.string().optional(),
  check_in_date: z.string().optional(),
  check_out_date: z.string().optional(),
  adults: z.coerce.number().int().min(1, 'Minimal 1 dewasa').max(MAX_ADULT_CAPACITY),
  children: z.coerce.number().int().min(0).max(MAX_ADULT_CAPACITY),
  babies: z.coerce.number().int().min(0).max(MAX_ADULT_CAPACITY),
}).superRefine((data, ctx) => {
  if (data.check_in_date && data.check_out_date && new Date(data.check_out_date) <= new Date(data.check_in_date)) {
    ctx.addIssue({ code: 'custom', message: 'Tanggal check-out harus lebih besar dari check-in', path: ['check_out_date'] });
  }
  if (data.children > data.adults) {
    ctx.addIssue({ code: 'custom', message: 'Jumlah anak tidak boleh melebihi jumlah dewasa', path: ['children'] });
  }
  if (data.babies > data.adults) {
    ctx.addIssue({ code: 'custom', message: 'Jumlah bayi tidak boleh melebihi jumlah dewasa', path: ['babies'] });
  }
});

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
