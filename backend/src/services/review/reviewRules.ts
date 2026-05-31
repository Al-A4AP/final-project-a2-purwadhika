import type { OrderStatus } from '@prisma/client';

export const assertValidRating = (rating: number) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating harus berupa bilangan bulat antara 1 dan 5');
  }
};

export const assertReviewAllowed = (status: OrderStatus, checkOutDate: Date) => {
  if (canReviewOrder(status, checkOutDate)) return;
  throw new Error('Ulasan hanya dapat diberikan setelah checkout selesai');
};

const canReviewOrder = (status: OrderStatus, checkOutDate: Date) => {
  if (status === 'COMPLETED') return true;
  return status === 'PROCESSED' && checkOutDate < new Date();
};
