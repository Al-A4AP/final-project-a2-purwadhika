import type { Order } from '@/types';
import type { OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from './constants';

const REFUND_REQUIRED_REASON_PREFIX = "REFUND_REQUIRED:";

export const isOrderStatus = (status: string): status is OrderStatus =>
  status in ORDER_STATUS_LABELS;

export const getOrderStatusLabel = (status: string) =>
  isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;

export const canReviewOrder = (order: Order) => {
  if (order.review) return false;
  if (order.status === 'COMPLETED') return true;
  return order.status === 'PROCESSED' && new Date(order.check_out_date) < new Date();
};

export const getUserRefundStatus = (order: Order): "PENDING" | "COMPLETED" | null => {
  if (!isManualRefundEligible(order)) return null;
  return order.refund_completed_at ? "COMPLETED" : "PENDING";
};

export const isManualRefundEligible = (order: Order) =>
  order.status === "CANCELLED"
  && order.payment_method === "MANUAL"
  && Boolean(order.payment_proof_url)
  && Boolean(order.payment_rejection_reason?.startsWith(REFUND_REQUIRED_REASON_PREFIX));
