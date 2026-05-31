import type { Order } from '@/types';
import type { OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from './constants';

export const isOrderStatus = (status: string): status is OrderStatus =>
  status in ORDER_STATUS_LABELS;

export const getOrderStatusLabel = (status: string) =>
  isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;

export const canReviewOrder = (order: Order) => {
  if (order.review) return false;
  if (order.status === 'COMPLETED') return true;
  return order.status === 'PROCESSED' && new Date(order.check_out_date) < new Date();
};
