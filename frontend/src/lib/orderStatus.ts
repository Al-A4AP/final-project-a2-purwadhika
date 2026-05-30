import type { Order } from '@/types';

export const canReviewOrder = (order: Order) => {
  if (order.review) return false;
  if (order.status === 'COMPLETED') return true;
  return order.status === 'PROCESSED' && new Date(order.check_out_date) < new Date();
};
