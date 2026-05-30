import { rateLimit } from 'express-rate-limit';

const createLimiter = (max: number, windowMinutes: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

export const authLimiter = createLimiter(
  10, 15,
  'Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.'
);

export const resendLimiter = createLimiter(
  20, 15,
  'Terlalu banyak permintaan. Silakan coba lagi dalam 15 menit.'
);

export const orderLimiter = createLimiter(
  5, 1,
  'Terlalu banyak permintaan pesanan. Silakan coba lagi dalam 1 menit.'
);

export const webhookLimiter = createLimiter(
  30, 1,
  'Terlalu banyak permintaan webhook.'
);

export const globalLimiter = createLimiter(
  200, 15,
  'Terlalu banyak permintaan. Silakan coba lagi nanti.'
);
