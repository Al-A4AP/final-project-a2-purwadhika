import { OrderStatus, PaymentMethod } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';

export const markRefundComplete = async (orderId: string, tenantId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, property: { tenantId } },
  });

  if (!order) {
    throw new AppError('Pesanan tidak ditemukan atau akses ditolak', 404);
  }

  if (order.status !== OrderStatus.CANCELLED) {
    throw new AppError('Pesanan belum dibatalkan, tidak dapat diproses refund.', 400);
  }

  if (order.payment_method !== PaymentMethod.MANUAL) {
    throw new AppError('Hanya pesanan dengan pembayaran manual yang dapat ditandai refund selesai.', 400);
  }

  if (!order.payment_proof_url) {
    throw new AppError('Pesanan tidak memiliki bukti pembayaran, tidak memerlukan refund.', 400);
  }

  if (order.refund_completed_at !== null) {
    throw new AppError('Refund untuk pesanan ini sudah ditandai selesai.', 400);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      refund_completed_at: new Date(),
      refund_completed_by: tenantId,
    },
  });
};
