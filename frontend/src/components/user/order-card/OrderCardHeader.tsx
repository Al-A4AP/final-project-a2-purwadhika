import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
import type { OrderCardProps } from "./types";

export const OrderCardHeader: FC<Pick<OrderCardProps, "StatusBadge" | "order">> = ({ StatusBadge, order }) => (
  <div className="mb-4 flex flex-col justify-between gap-4 border-b pb-4 dark:border-slate-700 md:flex-row md:items-center">
    <div>
      <p className="mb-1 text-sm text-gray-500">Order ID: {order.order_number}</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">{order.property?.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{order.room?.room_type}</p>
    </div>
    <div className="text-left md:text-right"><StatusBadge status={order.status} /><p className="mt-2 font-bold text-red-600">{formatPrice(order.total_price)}</p></div>
  </div>
);
