import multer from 'multer';
import { AppError } from './errorHandler';

const ALLOWED_TYPES = /jpeg|jpg|png|gif/;
const MAX_SIZE = 1 * 1024 * 1024; // 1MB

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.test(file.mimetype)) {
      return cb(new AppError('Hanya file JPG, PNG, GIF yang diperbolehkan', 400) as any);
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_SIZE },
});

const PAYMENT_ALLOWED_TYPES = /jpeg|jpg|png/;

export const uploadPaymentProof = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!PAYMENT_ALLOWED_TYPES.test(file.mimetype)) {
      return cb(new AppError('Hanya file JPG, JPEG, dan PNG yang diperbolehkan untuk bukti pembayaran', 400) as any);
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_SIZE },
});
