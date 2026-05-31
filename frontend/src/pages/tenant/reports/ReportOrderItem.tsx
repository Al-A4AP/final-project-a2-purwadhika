import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
import type { Order } from "@/types";

export const ReportOrderItem: FC<{ order: Order }> = ({ order }) => (
  <div className="flex justify-between items-center border-b dark:border-slate-700 pb-2"><div><p className="font-semibold text-gray-900 dark:text-white text-sm">{order.property?.name}</p><p className="text-xs text-gray-500">{order.user?.name} - {order.order_number} ({new Date(order.created_at).toLocaleDateString("id-ID")})</p></div><div className="text-right"><p className="font-bold text-sm text-gray-900 dark:text-white">{formatPrice(order.total_price)}</p><p className="text-xs text-gray-500">{order.status}</p></div></div>
);
