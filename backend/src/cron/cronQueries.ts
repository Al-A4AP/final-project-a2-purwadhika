import type { Order } from '@prisma/client';
import prisma from '../config/prisma';

export const findExpiredUnpaidOrders = (now: Date) => prisma.order.findMany({
  where: { status: 'WAITING_PAYMENT', expires_at: { lt: now } },
  include: { user: true },
});

export const cancelOrder = (orderId: string, now: Date) => prisma.order.update({
  where: { id: orderId },
  data: { status: 'CANCELLED', canceled_at: now },
});

export const findProcessedOrdersAfterCheckout = (now: Date) => prisma.order.findMany({
  where: { status: 'PROCESSED', check_out_date: { lt: now } },
});

export const completeOrder = (orderId: string, now: Date) => prisma.order.update({
  where: { id: orderId },
  data: { status: 'COMPLETED', completed_at: now },
});

export const findCheckInReminderOrders = (range: ReminderRange) => prisma.order.findMany({
  where: { status: 'PROCESSED', check_in_date: { gte: range.start, lt: range.end } },
  include: { user: true, property: true },
});

export type ReminderRange = { start: Date; end: Date };
export type ExpiredOrder = Awaited<ReturnType<typeof findExpiredUnpaidOrders>>[number];
export type ReminderOrder = Awaited<ReturnType<typeof findCheckInReminderOrders>>[number];
export type ProcessedOrder = Order;
