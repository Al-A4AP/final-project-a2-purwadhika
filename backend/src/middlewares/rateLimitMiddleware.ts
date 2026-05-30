import { rateLimit } from 'express-rate-limit';

const createLimiter = (max: number, windowMinutes: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

const isDev = process.env.NODE_ENV !== 'production';

export const authLimiter = createLimiter(
  isDev ? 1000 : 10, // Production default: 10 request / 15 menit
  15,
  'Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.'
);

export const resendLimiter = createLimiter(
  isDev ? 1000 : 20, // Production default: 20 request / 15 menit
  15,
  'Terlalu banyak permintaan. Silakan coba lagi dalam 15 menit.'
);

export const orderLimiter = createLimiter(
  isDev ? 1000 : 5, // Production default: 5 request / 1 menit
  1,
  'Terlalu banyak permintaan pesanan. Silakan coba lagi dalam 1 menit.'
);

export const webhookLimiter = createLimiter(
  isDev ? 1000 : 30, // Production default: 30 request / 1 menit
  1,
  'Terlalu banyak permintaan webhook.'
);

export const globalLimiter = createLimiter(
  isDev ? 5000 : 600, // Production default: 600 request / 15 menit
  15,
  'Terlalu banyak permintaan. Silakan coba lagi nanti.'
);
