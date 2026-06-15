import { z } from 'zod';

export const createOrderSchema = z.object({
  roomId: z.string().min(1, 'Pilih kamar'),
  propertyId: z.string().min(1, 'Pilih properti'),
  check_in_date: z.string().datetime({ message: 'Format tanggal check-in tidak valid (ISO 8601)' }),
  check_out_date: z.string().datetime({ message: 'Format tanggal check-out tidak valid (ISO 8601)' }),
  payment_method: z.enum(['MANUAL', 'MIDTRANS']),
  booking_for_self: z.boolean().optional().default(true),
  guest_name: optionalText(),
  guest_legal_name: optionalText(),
  guest_phone: optionalText(),
  guest_email: z.string().email('Email tamu tidak valid').optional().or(z.literal('')),
  guest_ktp_address: optionalText(),
  guest_ktp_number: z.string().trim().regex(/^\d{16}$/, 'Nomor KTP harus terdiri dari 16 digit angka').optional().or(z.literal('')),
  guest_domicile_address: optionalText(),
  voucher_code: z.string().trim().min(3, 'Kode voucher minimal 3 karakter').optional().or(z.literal('')),
  adults: z.number().int().min(1, 'Minimal 1 orang dewasa'),
  children: z.number().int().min(0, 'Jumlah anak-anak tidak boleh negatif'),
  babies: z.number().int().min(0, 'Jumlah bayi tidak boleh negatif'),
}).superRefine(requireGuestIdentity);

function optionalText() {
  return z.string().trim().optional().or(z.literal(''));
}

function requireGuestIdentity(data: z.infer<typeof createOrderSchema>, ctx: z.RefinementCtx) {
  requireField(data.guest_legal_name, 'guest_legal_name', 'Nama sesuai KTP wajib diisi', ctx);
  requireField(data.guest_phone, 'guest_phone', 'Nomor telepon tamu wajib diisi', ctx);
  requireField(data.guest_ktp_number, 'guest_ktp_number', 'Nomor KTP tamu wajib diisi', ctx);
  requireField(data.guest_ktp_address, 'guest_ktp_address', 'Alamat sesuai KTP wajib diisi', ctx);
}

function requireField(value: unknown, path: string, message: string, ctx: z.RefinementCtx) {
  if (typeof value === 'string' && value.trim()) return;
  ctx.addIssue({ code: 'custom', message, path: [path] });
}

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PROCESSED', 'CANCELLED', 'WAITING_PAYMENT']),
  payment_rejection_reason: z.string().trim().optional(),
});

export const paymentAttemptSchema = z.object({
  payment_method: z.enum(['MIDTRANS']).optional(),
});
