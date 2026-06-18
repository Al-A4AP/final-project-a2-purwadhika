import type { Order } from '@prisma/client';
import prisma from '../config/prisma';

export const findExpiredUnpaidOrders = (now: Date) => prisma.order.findMany({
  where: { status: 'WAITING_PAYMENT', expires_at: { lt: now } },
  include: { user: true },
});

export const findExpiredManualConfirmationOrders = (cutoff: Date) => prisma.order.findMany({
  where: { status: 'WAITING_CONFIRMATION', payment_proof_url: { not: null }, updated_at: { lt: cutoff } },
  include: { user: true },
});

export const cancelOrder = (orderId: string, now: Date) => prisma.order.update({
  where: { id: orderId },
  data: { status: 'CANCELLED', canceled_at: now },
});

export const cancelExpiredManualConfirmationOrder = (
  orderId: string,
  now: Date,
  reason: string,
) => prisma.order.update({
  where: { id: orderId },
  data: {
    status: 'CANCELLED',
    canceled_at: now,
    payment_proof_url: null,
    payment_rejection_reason: reason,
    refund_completed_at: null,
    refund_completed_by: null,
  },
});

export const findProcessedOrdersAfterCheckout = (now: Date) => prisma.order.findMany({
  where: { status: 'PROCESSED', check_out_date: { lt: now } },
});

export const completeOrder = (orderId: string, now: Date) => prisma.order.update({
  where: { id: orderId },
  data: { status: 'COMPLETED', completed_at: now },
});

export const findCheckInReminderOrders = (range: ReminderRange) => prisma.order.findMany({
  where: { 
    status: 'PROCESSED', 
    check_in_reminder_sent_at: null,
    check_in_date: { gt: range.start, lte: range.end } 
  },
  include: { user: true, property: true },
});

export const updateCheckInReminderSent = (orderId: string, now: Date) => prisma.order.update({
  where: { id: orderId },
  data: { check_in_reminder_sent_at: now },
});

export const deleteExpiredRevokedTokens = (now: Date) => prisma.revokedToken.deleteMany({
  where: { expires_at: { lt: now } },
});

export type ReminderRange = { start: Date; end: Date };
export type ExpiredOrder = Awaited<ReturnType<typeof findExpiredUnpaidOrders>>[number];
export type ExpiredManualConfirmationOrder = Awaited<ReturnType<typeof findExpiredManualConfirmationOrders>>[number];
export type ReminderOrder = Awaited<ReturnType<typeof findCheckInReminderOrders>>[number];
export type ProcessedOrder = Order;
