import type { Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export const getTenantReviews = async (tenantId: string, page = 1, limit = 10) => {
  const where = buildTenantReviewWhere(tenantId);
  const [reviews, total] = await fetchTenantReviewPage(where, page, limit);
  return { reviews, pagination: buildPagination(page, limit, total) };
};

const buildTenantReviewWhere = (tenantId: string): Prisma.ReviewWhereInput => ({
  property: { tenantId },
  deleted_at: null,
});

const fetchTenantReviewPage = (where: Prisma.ReviewWhereInput, page: number, limit: number) =>
  Promise.all([
    prisma.review.findMany({ where, include: reviewInclude, orderBy: { created_at: 'desc' }, skip: getSkip(page, limit), take: limit }),
    prisma.review.count({ where }),
  ]);

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

const getSkip = (page: number, limit: number) =>
  (page - 1) * limit;

const reviewInclude = {
  user: { select: { name: true, avatar_url: true } },
  property: { select: { id: true, name: true } },
  replies: { where: { deleted_at: null } },
};
