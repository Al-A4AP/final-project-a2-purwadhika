import { z } from 'zod';
import { REVIEW_COMMENT_MAX_LENGTH, REVIEW_REPLY_MAX_LENGTH } from '../constants/validation';

const normalizeComment = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

export const createReviewSchema = z.object({
  rating: z.coerce.number().int('Rating wajib berupa angka bulat').min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5'),
  comment: z.preprocess(normalizeComment, z.string().max(REVIEW_COMMENT_MAX_LENGTH, `Komentar maksimal ${REVIEW_COMMENT_MAX_LENGTH} karakter`)),
});

export const replyReviewSchema = z.object({
  reply_text: z.string().trim().max(REVIEW_REPLY_MAX_LENGTH, `Balasan maksimal ${REVIEW_REPLY_MAX_LENGTH} karakter`),
});
