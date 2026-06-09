import { z } from 'zod';

const fullNameSchema = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, ' '))
  .refine((value) => value.length > 0, {
    message: 'Nama wajib diisi',
  })
  .refine((value) => value.length >= 3, {
    message: 'Nama minimal 3 karakter',
  })
  .refine((value) => value.length <= 100, {
    message: 'Nama maksimal 100 karakter',
  })
  .refine((value) => /^[a-zA-Z\s]+$/.test(value), {
    message: 'Nama hanya boleh berisi huruf dan spasi',
  });

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const registerSchema = z.object({
  name: fullNameSchema,
  email: z.string().email('Email tidak valid'),
  role: z.enum(['USER', 'TENANT']).default('USER'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;