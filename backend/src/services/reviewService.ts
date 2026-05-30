import prisma from "../config/prisma";

export const createReview = async (
  userId: string,
  orderId: string,
  rating: number,
  comment: string,
) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating harus berupa bilangan bulat antara 1 dan 5");
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });
  if (!order) throw new Error("Order tidak ditemukan atau belum selesai");
  if (!canReviewOrder(order.status, order.check_out_date)) {
    throw new Error("Ulasan hanya dapat diberikan setelah checkout selesai");
  }

  const existingReview = await prisma.review.findUnique({ where: { orderId } });
  if (existingReview)
    throw new Error("Anda sudah memberikan ulasan untuk pesanan ini");

  return prisma.review.create({
    data: {
      orderId,
      propertyId: order.propertyId,
      userId,
      rating,
      comment,
    },
  });
};

const canReviewOrder = (status: string, checkOutDate: Date) => {
  if (status === "COMPLETED") return true;
  return status === "PROCESSED" && checkOutDate < new Date();
};

export const getPropertyReviews = async (propertyId: string) => {
  return prisma.review.findMany({
    where: { propertyId, deleted_at: null },
    include: {
      user: { select: { name: true, avatar_url: true } },
      replies: {
        where: { deleted_at: null },
        include: { tenant: { select: { name: true, avatar_url: true } } },
      },
    },
    orderBy: { created_at: "desc" },
  });
};

export const replyReview = async (
  tenantId: string,
  reviewId: string,
  reply_text: string,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { property: true },
  });

  if (!review || review.property.tenantId !== tenantId) {
    throw new Error("Review tidak ditemukan atau Anda tidak berhak membalas");
  }

  return prisma.reviewReply.create({
    data: {
      reviewId,
      tenantId,
      reply_text,
    },
  });
};
