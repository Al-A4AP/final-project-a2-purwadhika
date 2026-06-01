import {
  createReviewRecord, createReviewReplyRecord, findPropertyReviews, findReviewByOrder,
  findReviewableOrder, findTenantReview, softDeleteReviewRecord,
} from './review/reviewQueries';
import { assertReviewAllowed, assertValidRating } from './review/reviewRules';

export const createReview = async (userId: string, orderId: string, rating: number, comment: string) => {
  assertValidRating(rating);
  const order = await getReviewableOrderOrThrow(orderId, userId);
  assertReviewAllowed(order.status, order.check_out_date);
  await ensureReviewDoesNotExist(orderId);
  return createReviewRecord({ orderId, propertyId: order.propertyId, userId, rating, comment });
};

export const getPropertyReviews = (propertyId: string) => findPropertyReviews(propertyId);

export const replyReview = async (tenantId: string, reviewId: string, reply_text: string) => {
  await ensureTenantCanManageReview(tenantId, reviewId, 'membalas');
  return createReviewReplyRecord(reviewId, tenantId, reply_text);
};

export const deleteTenantReview = async (tenantId: string, reviewId: string) => {
  await ensureTenantCanManageReview(tenantId, reviewId, 'menghapus');
  await softDeleteReviewRecord(reviewId);
};

const getReviewableOrderOrThrow = async (orderId: string, userId: string) => {
  const order = await findReviewableOrder(orderId, userId);
  if (!order) throw new Error('Order tidak ditemukan atau belum selesai');
  return order;
};

const ensureReviewDoesNotExist = async (orderId: string) => {
  const existingReview = await findReviewByOrder(orderId);
  if (existingReview) throw new Error('Anda sudah memberikan ulasan untuk pesanan ini');
};

const ensureTenantCanManageReview = async (tenantId: string, reviewId: string, action: string) => {
  const review = await findTenantReview(reviewId);
  if (!review || review.property.tenantId !== tenantId) {
    throw new Error(`Review tidak ditemukan atau Anda tidak berhak ${action}`);
  }
};
