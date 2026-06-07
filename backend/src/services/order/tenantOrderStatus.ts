import { OrderStatus, type Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { createPaymentDeadline } from '../../constants/orderConstants';
import { AppError } from '../../middlewares/errorHandler';
import { issueReferralRewardForProcessedOrder } from '../referralRewardService';
import { sendPaymentConfirmationEmail, sendPaymentRejectionEmail } from '../../utils/emailService';

export const updateTenantOrderStatus = async (orderId: string, tenantId: string, status: string) => {
  const order = await findTenantOrderForStatus(orderId, tenantId);
  const transition = buildTenantStatusUpdate(order.status, status);
  const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: transition.updateData });
  await issueRewardIfProcessed(updatedOrder.id, transition.finalStatus);
  await handleOrderStatusEmail(order, transition.finalStatus, status);
  return updatedOrder;
};

const findTenantOrderForStatus = async (orderId: string, tenantId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: tenantStatusInclude });
  if (!order || order.property.tenantId !== tenantId) throw new AppError('Akses ditolak', 404);
  return order;
};

const buildTenantStatusUpdate = (currentStatus: OrderStatus, requestedStatus: string): TenantStatusTransition => {
  if (currentStatus === OrderStatus.WAITING_CONFIRMATION && requestedStatus === OrderStatus.PROCESSED) return processedTransition();
  if (currentStatus === OrderStatus.WAITING_CONFIRMATION && requestedStatus === OrderStatus.CANCELLED) return rejectedManualTransition();
  if (currentStatus === OrderStatus.WAITING_PAYMENT && requestedStatus === OrderStatus.CANCELLED) return cancelledTransition();
  throw new AppError(`Transisi status dari ${currentStatus} ke ${requestedStatus} tidak diperbolehkan`, 400);
};

const handleOrderStatusEmail = async (order: TenantStatusOrder, finalStatus: OrderStatus, requestedStatus: string) => {
  if (finalStatus === OrderStatus.PROCESSED) await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
  if (shouldSendRejectionEmail(order.status, requestedStatus)) await sendPaymentRejectionEmail(order.user.email, order.order_number).catch(() => {});
};

const issueRewardIfProcessed = (orderId: string, finalStatus: OrderStatus) => {
  if (finalStatus !== OrderStatus.PROCESSED) return Promise.resolve();
  return issueReferralRewardForProcessedOrder(orderId).then(() => undefined).catch(() => undefined);
};

const processedTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.PROCESSED, updateData: { status: OrderStatus.PROCESSED, payment_verified_at: new Date() } });

const rejectedManualTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.WAITING_PAYMENT, updateData: { status: OrderStatus.WAITING_PAYMENT, payment_proof_url: null, expires_at: createPaymentDeadline() } });

const cancelledTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.CANCELLED, updateData: { status: OrderStatus.CANCELLED, canceled_at: new Date() } });

const shouldSendRejectionEmail = (currentStatus: OrderStatus, requestedStatus: string) =>
  currentStatus === OrderStatus.WAITING_CONFIRMATION && requestedStatus === OrderStatus.CANCELLED;

const tenantStatusInclude = { property: true, user: true } satisfies Prisma.OrderInclude;

type TenantStatusOrder = Prisma.OrderGetPayload<{ include: typeof tenantStatusInclude }>;

interface TenantStatusTransition {
  finalStatus: OrderStatus;
  updateData: Prisma.OrderUpdateInput;
}
