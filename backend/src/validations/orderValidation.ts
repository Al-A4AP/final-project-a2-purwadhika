import { z } from 'zod';

export const createOrderSchema = z.object({
  roomId: z.string().min(1, 'Pilih kamar'),
  propertyId: z.string().min(1, 'Pilih properti'),
  check_in_date: z.string().datetime({ message: 'Format tanggal check-in tidak valid (ISO 8601)' }),
  check_out_date: z.string().datetime({ message: 'Format tanggal check-out tidak valid (ISO 8601)' }),
  payment_method: z.enum(['MANUAL', 'MIDTRANS']),
  adults: z.number().int().min(1, 'Minimal 1 orang dewasa'),
  children: z.number().int().min(0, 'Jumlah anak-anak tidak boleh negatif'),
  babies: z.number().int().min(0, 'Jumlah bayi tidak boleh negatif'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PROCESSED', 'CANCELLED']),
});

export const paymentAttemptSchema = z.object({
  payment_method: z.enum(['MIDTRANS']).optional(),
});
