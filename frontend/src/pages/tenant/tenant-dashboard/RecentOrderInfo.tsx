import type { FC } from "react";
import type { RecentOrder } from "@/types";
import { formatDate } from "@/lib/formatters";

export const RecentOrderInfo: FC<{ order: RecentOrder }> = ({ order }) => (
  <div className="space-y-1">
    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{order.user?.name}</p>
    <p className="truncate text-xs text-gray-500">{order.property?.name} <span className="mx-1 font-bold">-</span> {order.room?.room_type}</p>
    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
  </div>
);
