import { OrderStatus, PaymentMethod } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';

export const uploadPaymentProof = async (
  orderId: string,
  userId: string,
  imageUrl: string,
) => {
  const order = await findUserOrderOrThrow(orderId, userId);
  assertCanUploadPaymentProof(order);
  await assertPaymentProofNotExpired(order);
  return markPaymentProofUploaded(orderId, imageUrl);
};

const findUserOrderOrThrow = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) {
    throw new AppError("Pesanan tidak ditemukan atau akses ditolak", 404);
  }
  return order;
};

const assertCanUploadPaymentProof = (order: UserPaymentOrder) => {
  if (order.status !== OrderStatus.WAITING_PAYMENT) {
    throw new AppError("Pesanan tidak dalam status menunggu pembayaran", 400);
  }
  if (order.payment_method !== PaymentMethod.MANUAL) {
    throw new AppError("Bukti pembayaran hanya untuk pembayaran manual", 400);
  }
};

const assertPaymentProofNotExpired = async (order: UserPaymentOrder) => {
  if (!order.expires_at || order.expires_at > new Date()) return;
  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED, canceled_at: new Date() },
  });
  throw new AppError("Batas waktu upload bukti pembayaran telah berakhir", 400);
};

const markPaymentProofUploaded = (orderId: string, imageUrl: string) =>
  prisma.order.update({
    where: { id: orderId },
    data: {
      expires_at: null,
      payment_proof_url: imageUrl,
      status: OrderStatus.WAITING_CONFIRMATION,
    },
  });

type UserPaymentOrder = NonNullable<
  Awaited<ReturnType<typeof findUserOrderOrThrow>>
>;
