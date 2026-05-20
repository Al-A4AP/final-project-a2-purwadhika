import { z } from 'zod';

export const createOrderSchema = z.object({
  roomId: z.string().min(1, 'Pilih kamar'),
  propertyId: z.string().min(1, 'Pilih properti'),
  check_in_date: z.string().datetime({ message: 'Format tanggal check-in tidak valid (ISO 8601)' }),
  check_out_date: z.string().datetime({ message: 'Format tanggal check-out tidak valid (ISO 8601)' }),
  payment_method: z.enum(['MANUAL', 'MIDTRANS']),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'CANCELLED', 'COMPLETED']),
});
