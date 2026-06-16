import type { FC } from "react";
import { OrderCardBody } from "./order-card/OrderCardBody";
import { OrderCardMedia } from "./order-card/OrderCardMedia";
import type { OrderCardProps } from "./order-card/types";

export const OrderCard: FC<OrderCardProps> = (props) => (
  <div className="group mb-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-col md:flex-row">
      <OrderCardMedia StatusBadge={props.StatusBadge} order={props.order} />
      <OrderCardBody {...props} />
    </div>
  </div>
);
