import type { Order, PrismaClient, Property, Review, User } from '@prisma/client';
import { ORDER_SEEDS, REVIEW_SEEDS } from './data';

type ProcessedOrder = {
  order: Order;
  property: Property;
};

const getProcessedOrders = (orders: Order[], properties: Property[]): ProcessedOrder[] =>
  orders
    .map((order, index) => ({ order, seed: ORDER_SEEDS[index] }))
    .filter(({ seed }) => seed.status === 'PROCESSED')
    .map(({ order, seed }) => ({ order, property: properties[seed.propertyIndex] }));

const createReview = (
  prisma: PrismaClient,
  processedOrder: ProcessedOrder,
  reviewIndex: number,
) => prisma.review.create({
  data: {
    orderId: processedOrder.order.id,
    propertyId: processedOrder.property.id,
    userId: processedOrder.order.userId,
    ...REVIEW_SEEDS[reviewIndex],
  },
});

export const createReviews = async (
  prisma: PrismaClient,
  orders: Order[],
  properties: Property[],
): Promise<Review[]> => {
  const processedOrders = getProcessedOrders(orders, properties);
  const limit = Math.min(processedOrders.length, REVIEW_SEEDS.length);

  return Promise.all(
    processedOrders.slice(0, limit).map((processedOrder, index) =>
      createReview(prisma, processedOrder, index),
    ),
  );
};

export const createReviewReplies = async (
  prisma: PrismaClient,
  tenant: User,
  reviews: Review[],
) => {
  if (reviews.length < 3) return;

  await prisma.reviewReply.createMany({
    data: [
      { reviewId: reviews[0].id, tenantId: tenant.id, reply_text: 'Terima kasih atas reviewnya! Kami sangat senang Anda puas. Sampai jumpa kembali' },
      { reviewId: reviews[2].id, tenantId: tenant.id, reply_text: 'Terima kasih sudah memilih Villa Ubud Hijau! Senang Anda menikmati kolam renang kami. Salam dari Ubud' },
    ],
  });
};
