import { z } from 'zod';
import { PHONE_REGEX } from '../constants/validation';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter').optional(),
  ktp_number: z.string().regex(/^\d{16}$/, 'Nomor KTP harus terdiri dari 16 digit angka.').optional().or(z.literal('')),
  legal_name: z.string().trim().min(3, 'Nama sesuai KTP minimal 3 karakter').max(100, 'Nama sesuai KTP maksimal 100 karakter').optional().or(z.literal('')),
  ktp_address: z.string().trim().min(10, 'Alamat minimal 10 karakter').max(255, 'Alamat maksimal 255 karakter').optional().or(z.literal('')),
  phone: z.string().trim().regex(PHONE_REGEX, 'Format nomor telepon tidak valid').optional().or(z.literal('')),
});

export const requestEmailChangeSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
});
