import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional().or(z.literal('')),
  phone: z.string().optional(),
});

export const emailChangeSchema = z.object({
  email: z.string().trim().min(1, 'Email baru wajib diisi').email('Email tidak valid'),
});

export const passwordSchema = z.object({
  old_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
  confirm_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type EmailChangeInput = z.infer<typeof emailChangeSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
