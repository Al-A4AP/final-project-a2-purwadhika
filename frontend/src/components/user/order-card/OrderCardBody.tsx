import type { FC } from "react";
import { OrderReviewForm } from "./OrderReviewForm";
import { OrderCardFooter } from "./OrderCardFooter";
import { OrderCardMainInfo } from "./OrderCardMainInfo";
import type { OrderCardProps } from "./types";

export const OrderCardBody: FC<OrderCardProps> = (props) => (
  <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
    <OrderCardMainInfo order={props.order} />
    <OrderCardFooter {...props} />
    {props.reviewOrderId === props.order.id && <OrderReviewSection {...props} />}
  </div>
);

const OrderReviewSection: FC<OrderCardProps> = (props) => (
  <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
    <OrderReviewForm {...props} />
  </div>
);
