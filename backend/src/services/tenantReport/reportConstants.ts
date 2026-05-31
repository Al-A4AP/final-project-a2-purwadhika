import type { OrderStatus } from '@prisma/client';

export const REVENUE_STATUSES: OrderStatus[] = ['PROCESSED', 'COMPLETED'];

const ORDER_STATUSES: OrderStatus[] = [
  'WAITING_PAYMENT',
  'WAITING_CONFIRMATION',
  'PROCESSED',
  'CANCELLED',
  'COMPLETED',
];

export const parseOrderStatus = (status?: string) =>
  ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
