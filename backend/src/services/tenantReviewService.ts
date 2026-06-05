import type { Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export const getTenantReviews = async (tenantId: string, page = 1, limit = 10) => {
  const where = buildTenantReviewWhere(tenantId);
  const [[reviews, total], summary] = await Promise.all([
    fetchTenantReviewPage(where, page, limit),
    fetchTenantReviewSummary(where),
  ]);
  return { reviews, pagination: buildPagination(page, limit, total), summary };
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

const fetchTenantReviewSummary = async (where: Prisma.ReviewWhereInput) => {
  const reviews = await prisma.review.findMany({ where, select: reviewSummarySelect });
  return {
    byCategory: buildCategorySummary(reviews),
    byProperty: buildPropertySummary(reviews),
  };
};

const buildCategorySummary = (reviews: SummaryReview[]) =>
  toRatingSummary(reviews, (review) => ({
    id: review.property.category?.id || 'uncategorized',
    name: review.property.category?.name || 'Tanpa kategori',
  }));

const buildPropertySummary = (reviews: SummaryReview[]) =>
  toRatingSummary(reviews, (review) => ({
    id: review.property.id,
    name: review.property.name,
  }));

const toRatingSummary = (reviews: SummaryReview[], getGroup: GroupSelector) => {
  const groups = new Map<string, RatingAccumulator>();
  reviews.forEach((review) => addRating(groups, getGroup(review), review.rating));
  return [...groups.values()].map(toRatingSummaryItem);
};

const addRating = (groups: Map<string, RatingAccumulator>, group: RatingGroup, rating: number) => {
  const current = groups.get(group.id) || { ...group, totalRating: 0, totalReviews: 0 };
  groups.set(group.id, { ...current, totalRating: current.totalRating + rating, totalReviews: current.totalReviews + 1 });
};

const toRatingSummaryItem = (item: RatingAccumulator) => ({
  averageRating: roundRating(item.totalRating / item.totalReviews),
  id: item.id,
  name: item.name,
  totalReviews: item.totalReviews,
});

const roundRating = (value: number) =>
  Math.round(value * 10) / 10;

const reviewInclude = {
  user: { select: { name: true, avatar_url: true } },
  property: { select: { id: true, name: true } },
  replies: { where: { deleted_at: null } },
};

const reviewSummarySelect = {
  rating: true,
  property: {
    select: {
      id: true,
      name: true,
      category: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.ReviewSelect;

type SummaryReview = Prisma.ReviewGetPayload<{ select: typeof reviewSummarySelect }>;
type GroupSelector = (review: SummaryReview) => RatingGroup;

interface RatingGroup {
  id: string;
  name: string;
}

interface RatingAccumulator extends RatingGroup {
  totalRating: number;
  totalReviews: number;
}
