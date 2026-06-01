import type { OrderStatus } from '@prisma/client';
import prisma from '../../config/prisma';
import { normalizePaymentOrderId } from './paymentOrderId';

export const findOrderForPayment = (orderId: string) => prisma.order.findUnique({
  where: { id: normalizePaymentOrderId(orderId) },
  include: { user: true },
});

export const updatePaymentStatus = (orderId: string, status: OrderStatus, transactionId?: string) => prisma.order.update({
  where: { id: orderId },
  data: {
    status,
    midtrans_transaction_id: transactionId,
    payment_verified_at: status === 'PROCESSED' ? new Date() : null,
  },
});
