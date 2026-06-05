import type { FC } from "react";
import { formatCurrency } from "@/lib/formatters";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/tenant/OrderStatusBadge";

export const ReportOrderItem: FC<{ order: Order }> = ({ order }) => (
  <div className="group flex flex-col gap-4 rounded-xl p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-3">
        <p className="truncate font-bold text-slate-900 dark:text-white">{order.property?.name}</p>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-700 dark:text-slate-300">{order.user?.name}</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />
        <span>{order.order_number}</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />
        <span>{new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
    </div>
    <div className="sm:text-right shrink-0">
      <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(order.total_price)}</p>
    </div>
  </div>
);
