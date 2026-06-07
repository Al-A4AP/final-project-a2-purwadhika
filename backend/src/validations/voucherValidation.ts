import { z } from 'zod';

export const voucherSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]+$/, 'Kode voucher hanya boleh berisi huruf dan angka').min(3, 'Kode voucher minimal 3 karakter').max(15, 'Kode voucher maksimal 15 karakter'),
  description: z.string().trim().max(160, 'Deskripsi maksimal 160 karakter').optional().or(z.literal('')),
  discount_type: z.enum(['PERCENTAGE', 'NOMINAL', 'FREE_NIGHTS']).default('PERCENTAGE'),
  discount_value: z.coerce.number().int().positive('Nilai diskon wajib lebih dari 0'),
  expires_at: z.string().datetime({ message: 'Tanggal berakhir tidak valid' }),
  is_active: z.boolean().optional(),
  max_discount: z.coerce.number().int().positive().optional().nullable(),
  name: z.string().trim().max(80, 'Nama voucher maksimal 80 karakter').optional(),
  new_user_only: z.boolean().optional(),
  quota: z.coerce.number().int().positive().optional().nullable(),
  starts_at: z.string().datetime({ message: 'Tanggal mulai tidak valid' }),
}).superRefine(validateVoucherRules);

export const voucherPreviewSchema = z.object({
  propertyId: z.string().min(1, 'Properti wajib dipilih'),
  subtotal: z.coerce.number().int().positive('Subtotal wajib lebih dari 0'),
  voucher_code: z.string().trim().min(3, 'Kode voucher wajib diisi'),
  total_nights: z.coerce.number().int().positive().default(1),
});

function validateVoucherRules(data: VoucherInput, ctx: z.RefinementCtx) {
  if (data.discount_type === 'PERCENTAGE') {
    if (data.discount_value < 1) addIssue(ctx, 'discount_value', 'Diskon persentase minimal 1%');
    if (data.discount_value > 90) addIssue(ctx, 'discount_value', 'Diskon persentase maksimal 90%');
  } else if (data.discount_type === 'NOMINAL') {
    if (data.discount_value < 10000) addIssue(ctx, 'discount_value', 'Diskon nominal minimal Rp 10.000');
    if (data.discount_value > 1000000) addIssue(ctx, 'discount_value', 'Diskon nominal maksimal Rp 1.000.000');
  } else if (data.discount_type === 'FREE_NIGHTS') {
    if (data.discount_value < 1) addIssue(ctx, 'discount_value', 'Jumlah malam gratis minimal 1');
    if (data.discount_value > 30) addIssue(ctx, 'discount_value', 'Jumlah malam gratis maksimal 30');
  }
  if (new Date(data.starts_at) >= new Date(data.expires_at)) {
    addIssue(ctx, 'expires_at', 'Tanggal berakhir harus setelah tanggal mulai');
  }
  const today = new Date();
  today.setHours(0,0,0,0);
  if (new Date(data.starts_at) < today) {
    addIssue(ctx, 'starts_at', 'Tanggal mulai tidak boleh di masa lalu');
  }
  if (new Date(data.expires_at) < today) {
    addIssue(ctx, 'expires_at', 'Tanggal berakhir tidak boleh di masa lalu');
  }
}

const addIssue = (ctx: z.RefinementCtx, path: string, message: string) =>
  ctx.addIssue({ code: 'custom', message, path: [path] });

export type VoucherInput = z.infer<typeof voucherSchema>;
export type VoucherPreviewInput = z.infer<typeof voucherPreviewSchema>;
