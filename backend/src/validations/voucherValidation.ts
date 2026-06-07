import { z } from 'zod';

export const voucherSchema = z.object({
  code: z.string().trim().min(3, 'Kode voucher minimal 3 karakter').max(24, 'Kode voucher maksimal 24 karakter'),
  description: z.string().trim().max(160, 'Deskripsi maksimal 160 karakter').optional().or(z.literal('')),
  discount_type: z.enum(['PERCENTAGE', 'NOMINAL']).default('PERCENTAGE'),
  discount_value: z.coerce.number().int().positive('Nilai diskon wajib lebih dari 0'),
  expires_at: z.string().datetime({ message: 'Tanggal berakhir tidak valid' }),
  is_active: z.boolean().optional(),
  max_discount: z.coerce.number().int().positive().optional().nullable(),
  name: z.string().trim().min(3, 'Nama voucher minimal 3 karakter').max(80, 'Nama voucher maksimal 80 karakter'),
  new_user_only: z.boolean().optional(),
  quota: z.coerce.number().int().positive().optional().nullable(),
  starts_at: z.string().datetime({ message: 'Tanggal mulai tidak valid' }),
}).superRefine(validateVoucherRules);

export const voucherPreviewSchema = z.object({
  propertyId: z.string().min(1, 'Properti wajib dipilih'),
  subtotal: z.coerce.number().int().positive('Subtotal wajib lebih dari 0'),
  voucher_code: z.string().trim().min(3, 'Kode voucher wajib diisi'),
});

function validateVoucherRules(data: VoucherInput, ctx: z.RefinementCtx) {
  if (data.discount_type === 'PERCENTAGE' && data.discount_value > 100) {
    addIssue(ctx, 'discount_value', 'Diskon persentase maksimal 100%');
  }
  if (new Date(data.starts_at) >= new Date(data.expires_at)) {
    addIssue(ctx, 'expires_at', 'Tanggal berakhir harus setelah tanggal mulai');
  }
}

const addIssue = (ctx: z.RefinementCtx, path: string, message: string) =>
  ctx.addIssue({ code: 'custom', message, path: [path] });

export type VoucherInput = z.infer<typeof voucherSchema>;
export type VoucherPreviewInput = z.infer<typeof voucherPreviewSchema>;
