import { OrderStatus, type Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { buildTenantRejectionRefundReason } from '../../constants/orderConstants';
import { AppError } from '../../middlewares/errorHandler';
import { sendPaymentConfirmationEmail, sendPaymentRejectionEmail } from '../../utils/emailService';
import {
  TENANT_REJECTION_REASON_MAX_LENGTH,
  TENANT_REJECTION_REASON_MIN_LENGTH,
} from '../../constants/validation';

export const updateTenantOrderStatus = async (orderId: string, tenantId: string, status: string, payment_rejection_reason?: string) => {
  const order = await findTenantOrderForStatus(orderId, tenantId);
  const transition = buildTenantStatusUpdate(order.status, status, payment_rejection_reason);
  const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: transition.updateData });
  await handleOrderStatusEmail(order, transition);
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

const handleOrderStatusEmail = async (order: TenantStatusOrder, transition: TenantStatusTransition) => {
  if (transition.finalStatus === OrderStatus.PROCESSED) await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
  if (transition.rejectionReason) await sendPaymentRejectionEmail(order.user.email, order.order_number, transition.rejectionReason).catch(() => {});
};

const processedTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.PROCESSED, updateData: { status: OrderStatus.PROCESSED, payment_verified_at: new Date() } });

const rejectedManualTransition = (payment_rejection_reason?: string): TenantStatusTransition => {
  const rejectionReason = validateRejectionReason(payment_rejection_reason);
  return {
    finalStatus: OrderStatus.CANCELLED,
    rejectionReason,
    updateData: {
      status: OrderStatus.CANCELLED,
      canceled_at: new Date(),
      payment_rejection_reason: buildTenantRejectionRefundReason(rejectionReason),
    },
  };
};

const validateRejectionReason = (reason?: string) => {
  const normalized = reason?.trim() || '';
  if (normalized.length < TENANT_REJECTION_REASON_MIN_LENGTH) {
    throw new AppError(`Alasan penolakan minimal ${TENANT_REJECTION_REASON_MIN_LENGTH} karakter`, 400);
  }
  if (normalized.length > TENANT_REJECTION_REASON_MAX_LENGTH) {
    throw new AppError(`Alasan penolakan maksimal ${TENANT_REJECTION_REASON_MAX_LENGTH} karakter`, 400);
  }
  return normalized;
};

const cancelledTransition = (): TenantStatusTransition =>
  ({ finalStatus: OrderStatus.CANCELLED, updateData: { status: OrderStatus.CANCELLED, canceled_at: new Date() } });

const isManualRejection = (currentStatus: OrderStatus, requestedStatus: string) =>
  currentStatus === OrderStatus.WAITING_CONFIRMATION
  && (requestedStatus === OrderStatus.CANCELLED || requestedStatus === OrderStatus.WAITING_PAYMENT);

const tenantStatusInclude = { property: true, user: true } satisfies Prisma.OrderInclude;

type TenantStatusOrder = Prisma.OrderGetPayload<{ include: typeof tenantStatusInclude }>;

interface TenantStatusTransition {
  finalStatus: OrderStatus;
  rejectionReason?: string;
  updateData: Prisma.OrderUpdateInput;
}
