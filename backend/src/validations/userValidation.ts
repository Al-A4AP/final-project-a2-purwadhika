import { z } from 'zod';

export const updateProfileSchema = z.object({
  domicile_address: z.string().max(255, 'Alamat domisili maksimal 255 karakter').optional(),
  ktp_address: z.string().max(255, 'Alamat sesuai KTP maksimal 255 karakter').optional(),
  legal_name: z.string().min(3, 'Nama sesuai KTP minimal 3 karakter').max(100, 'Nama sesuai KTP maksimal 100 karakter').optional(),
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/, 'Format nomor telepon tidak valid').optional().or(z.literal('')),
});

export const requestEmailChangeSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
});
