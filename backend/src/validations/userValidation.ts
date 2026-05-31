import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  phone: z.string().optional(),
});

export const requestEmailChangeSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
});
