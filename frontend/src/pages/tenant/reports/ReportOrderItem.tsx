import type { FC } from "react";
import { getOrderStatusLabel } from "@/lib/orderStatus";
import { formatPrice } from "@/lib/formatters";
import type { Order } from "@/types";

export const ReportOrderItem: FC<{ order: Order }> = ({ order }) => (
  <div className="flex flex-col gap-2 border-b pb-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{order.property?.name}</p>
      <p className="text-xs text-gray-500">{order.user?.name} - {order.order_number} ({new Date(order.created_at).toLocaleDateString("id-ID")})</p>
    </div>
    <div className="sm:text-right">
      <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(order.total_price)}</p>
      <p className="text-xs text-gray-500">{getOrderStatusLabel(order.status)}</p>
    </div>
  </div>
);
