import { OrderStatus, type Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { buildTenantRejectionRefundReason } from '../../constants/orderConstants';
import { AppError } from '../../middlewares/errorHandler';
import { sendPaymentConfirmationEmail, sendPaymentRejectionEmail } from '../../utils/emailService';

export const updateTenantOrderStatus = async (orderId: string, tenantId: string, status: string, payment_rejection_reason?: string) => {
  const order = await findTenantOrderForStatus(orderId, tenantId);
  const transition = buildTenantStatusUpdate(order.status, status, payment_rejection_reason);
  const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: transition.updateData });
  await handleOrderStatusEmail(order, transition.finalStatus, status);
  return updatedOrder;
};

const findTenantOrderForStatus = async (orderId: string, tenantId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: tenantStatusInclude });
  if (!order || order.property.tenantId !== tenantId) throw new AppError('Akses ditolak', 404);
  return order;
};

const buildTenantStatusUpdate = (currentStatus: OrderStatus, requestedStatus: string, payment_rejection_reason?: string): TenantStatusTransition => {
  if (currentStatus === OrderStatus.WAITING_CONFIRMATION && requestedStatus === OrderStatus.PROCESSED) return processedTransition();
  if (isManualRejection(currentStatus, requestedStatus)) return rejectedManualTransition(payment_rejection_reason);
  if (currentStatus === OrderStatus.WAITING_PAYMENT && requestedStatus === OrderStatus.CANCELLED) return cancelledTransition();
  throw new AppError(`Transisi status dari ${currentStatus} ke ${requestedStatus} tidak diperbolehkan`, 400);
};

const handleOrderStatusEmail = async (order: TenantStatusOrder, finalStatus: OrderStatus, requestedStatus: string) => {
  if (finalStatus === OrderStatus.PROCESSED) await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
  if (shouldSendRejectionEmail(order.status, requestedStatus)) await sendPaymentRejectionEmail(order.user.email, order.order_number).catch(() => {});
};

const processedTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.PROCESSED, updateData: { status: OrderStatus.PROCESSED, payment_verified_at: new Date() } });

const rejectedManualTransition = (payment_rejection_reason?: string): TenantStatusTransition => {
  if (!payment_rejection_reason?.trim()) throw new AppError('Alasan penolakan wajib diisi', 400);
  return {
    finalStatus: OrderStatus.CANCELLED,
    updateData: {
      status: OrderStatus.CANCELLED,
      canceled_at: new Date(),
      payment_rejection_reason: buildTenantRejectionRefundReason(payment_rejection_reason),
    },
  };
};

const cancelledTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.CANCELLED, updateData: { status: OrderStatus.CANCELLED, canceled_at: new Date() } });

const shouldSendRejectionEmail = (currentStatus: OrderStatus, requestedStatus: string) =>
  isManualRejection(currentStatus, requestedStatus);

const isManualRejection = (currentStatus: OrderStatus, requestedStatus: string) =>
  currentStatus === OrderStatus.WAITING_CONFIRMATION
  && (requestedStatus === OrderStatus.CANCELLED || requestedStatus === OrderStatus.WAITING_PAYMENT);

const tenantStatusInclude = { property: true, user: true } satisfies Prisma.OrderInclude;

type TenantStatusOrder = Prisma.OrderGetPayload<{ include: typeof tenantStatusInclude }>;

interface TenantStatusTransition {
  finalStatus: OrderStatus;
  updateData: Prisma.OrderUpdateInput;
}
