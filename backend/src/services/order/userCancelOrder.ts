import { OrderStatus, PaymentMethod } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { sendCancellationEmail, sendManualRefundTenantEmail } from '../../utils/emailService';

export const cancelUserOrder = async (orderId: string, userId: string) => {
  const order = await findUserOrder(orderId, userId);
  assertCancelableOrder(order);
  
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED, canceled_at: new Date() },
    include: {
      user: { select: { email: true, name: true } },
      property: { select: { name: true, tenant: { select: { email: true, name: true } } } }
    }
  });

  const isManualConfirmation = order.status === OrderStatus.WAITING_CONFIRMATION && order.payment_method === PaymentMethod.MANUAL && Boolean(order.payment_proof_url);
  
  await sendCancellationEmail(updatedOrder.user.email, updatedOrder.order_number, "Dibatalkan oleh pengguna", isManualConfirmation).catch(() => {});
  
  if (isManualConfirmation) {
    await sendManualRefundTenantEmail(
      updatedOrder.property.tenant.email,
      updatedOrder.order_number,
      updatedOrder.user.name,
      updatedOrder.property.name,
      updatedOrder.check_in_date
    ).catch(() => {});
  }
  
  return updatedOrder;
};

const findUserOrder = (orderId: string, userId: string) =>
  prisma.order.findFirst({ where: { id: orderId, userId } });

const assertCancelableOrder = (order: UserOrderRecord) => {
  if (!order) throw new AppError('Pesanan tidak ditemukan atau akses ditolak', 404);
  if (order.status !== OrderStatus.WAITING_PAYMENT && order.status !== OrderStatus.WAITING_CONFIRMATION) {
    throw new AppError('Pesanan tidak dapat dibatalkan pada status ini', 400);
  }
};

type UserOrderRecord = Awaited<ReturnType<typeof findUserOrder>>;
