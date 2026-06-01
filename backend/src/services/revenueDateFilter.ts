import type { Prisma } from '@prisma/client';

export const buildVerifiedRevenueDateWhere = (start: Date, end: Date): Prisma.OrderWhereInput => ({
  OR: [
    { payment_verified_at: buildRevenueDateFilter(start, end) },
    { payment_verified_at: null, completed_at: buildRevenueDateFilter(start, end) },
    { payment_verified_at: null, completed_at: null, created_at: buildRevenueDateFilter(start, end) },
  ],
});

const buildRevenueDateFilter = (start: Date, end: Date): Prisma.DateTimeFilter => ({
  gte: start,
  lt: end,
});
