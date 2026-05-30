import type { FC } from 'react';
import type { OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'Menunggu Pembayaran',
  WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
  PROCESSED: 'Dikonfirmasi',
  COMPLETED: 'Selesai Menginap',
  CANCELLED: 'Dibatalkan',
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  WAITING_CONFIRMATION: 'bg-blue-100 text-blue-800',
  PROCESSED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const OrderStatusBadge: FC<{ status: OrderStatus }> = ({ status }) => (
  <span className={`rounded-md px-2 py-1 text-xs font-medium ${STATUS_CLASSES[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);
