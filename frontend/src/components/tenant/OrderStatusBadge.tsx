import type { FC } from 'react';
import type { OrderStatus } from '@/types';
import { ORDER_STATUS_BADGE_CLASSES } from '@/lib/constants';
import { getOrderStatusLabel } from '@/lib/orderStatus';

export const OrderStatusBadge: FC<{ status: OrderStatus }> = ({ status }) => (
  <span className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ${ORDER_STATUS_BADGE_CLASSES[status]}`}>
    {getOrderStatusLabel(status)}
  </span>
);
