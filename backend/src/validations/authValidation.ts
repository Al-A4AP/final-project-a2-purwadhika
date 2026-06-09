import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Nama wajib diisi')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf dan spasi')
    .transform((val) => val.replace(/\s+/g, ' '))
    .refine((val) => val.length >= 3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['USER', 'TENANT']).optional().default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const googleLoginSchema = z.object({
  accessToken: z.string().min(1, 'Token Google wajib diisi'),
  role: z.enum(['USER', 'TENANT']).optional(),
  mode: z.enum(['login', 'register']).optional(),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const resendVerificationSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const verifyEmailChangeSchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
});
