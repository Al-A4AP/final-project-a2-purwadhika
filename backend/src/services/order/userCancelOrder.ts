import { OrderStatus } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';

export const cancelUserManualOrder = async (orderId: string, userId: string) => {
  const order = await findUserOrder(orderId, userId);
  assertCancelableManualOrder(order);
  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED, canceled_at: new Date() },
  });
};

const findUserOrder = (orderId: string, userId: string) =>
  prisma.order.findFirst({ where: { id: orderId, userId } });

const assertCancelableManualOrder = (order: UserOrderRecord) => {
  if (!order) throw new AppError('Pesanan tidak ditemukan atau akses ditolak', 404);
  if (order.status !== OrderStatus.WAITING_PAYMENT) throw new AppError('Pesanan tidak dalam status menunggu pembayaran', 400);
  if (order.payment_method !== 'MANUAL') throw new AppError('Pembatalan hanya tersedia untuk pembayaran manual', 400);
};

type UserOrderRecord = Awaited<ReturnType<typeof findUserOrder>>;
