import type { FC } from 'react';
import { OrderCardDetails } from './order-card/OrderCardDetails';
import { OrderCardHeader } from './order-card/OrderCardHeader';
import { OrderReviewForm } from './order-card/OrderReviewForm';
import type { OrderCardProps } from './order-card/types';

export const OrderCard: FC<OrderCardProps> = (props) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <OrderCardHeader order={props.order} StatusBadge={props.StatusBadge} />
    <OrderCardDetails {...props} />
    {props.reviewOrderId === props.order.id && <OrderReviewForm {...props} />}
  </div>
);
