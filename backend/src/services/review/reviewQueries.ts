import prisma from '../../config/prisma';

export const findReviewableOrder = (orderId: string, userId: string) =>
  prisma.order.findFirst({ where: { id: orderId, userId } });

export const findReviewByOrder = (orderId: string) =>
  prisma.review.findUnique({ where: { orderId } });

export const createReviewRecord = (data: CreateReviewRecordData) =>
  prisma.review.create({ data });

export const findPropertyReviews = (propertyId: string) => prisma.review.findMany({
  where: { propertyId, deleted_at: null },
  include: {
    user: { select: { name: true, avatar_url: true } },
    replies: { where: { deleted_at: null }, include: { tenant: { select: { name: true, avatar_url: true } } } },
  },
  orderBy: { created_at: 'desc' },
});

export const findTenantReview = (reviewId: string) =>
  prisma.review.findUnique({ where: { id: reviewId }, include: { property: true } });

export const createReviewReplyRecord = (reviewId: string, tenantId: string, replyText: string) =>
  prisma.reviewReply.create({ data: { reviewId, tenantId, reply_text: replyText } });

interface CreateReviewRecordData {
  orderId: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
}
